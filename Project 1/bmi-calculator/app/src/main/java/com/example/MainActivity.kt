package com.example

import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.animation.Crossfade
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.Icon
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.ui.BmiViewModel
import com.example.ui.components.GlassCanvasBackground
import com.example.ui.components.GlassNavigationBar
import com.example.ui.screens.CalculatorScreen
import com.example.ui.screens.HealthTipsScreen
import com.example.ui.screens.HistoryScreen
import com.example.ui.screens.SettingsGoalsScreen
import com.example.ui.theme.GlassBorder
import com.example.ui.theme.GlassSurfaceHighlight
import com.example.ui.theme.MyApplicationTheme
import com.example.ui.theme.Slate500
import com.example.ui.theme.Slate800

class MainActivity : ComponentActivity() {
    private val viewModel: BmiViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MyApplicationTheme {
                BmiApp(viewModel = viewModel)
            }
        }
    }
}

@Composable
fun BmiApp(viewModel: BmiViewModel) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    val historyRecords by viewModel.historyRecords.collectAsStateWithLifecycle()
    val context = LocalContext.current

    val onSaveRecord: () -> Unit = {
        Toast.makeText(context, "BMI record saved to history!", Toast.LENGTH_SHORT).show()
    }

    GlassCanvasBackground {
        Scaffold(
            containerColor = Color.Transparent,
            bottomBar = {
                GlassNavigationBar(
                    selectedTab = uiState.selectedTab,
                    onTabSelected = { viewModel.setSelectedTab(it) },
                    onFabClick = {
                        viewModel.saveCurrentBmiRecord()
                        onSaveRecord()
                    }
                )
            }
        ) { innerPadding ->
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(innerPadding)
            ) {
                // Frosted Glass App Top Bar Header
                TopHeaderBar(
                    selectedTab = uiState.selectedTab,
                    onProfileClick = {
                        // Switch to Settings/Goals tab
                        viewModel.setSelectedTab(3)
                    }
                )

                // Active Tab Content with Smooth Transition
                Crossfade(
                    targetState = uiState.selectedTab,
                    animationSpec = tween(300),
                    label = "screen_crossfade",
                    modifier = Modifier.weight(1f)
                ) { tab ->
                    when (tab) {
                        0 -> CalculatorScreen(
                            uiState = uiState,
                            viewModel = viewModel,
                            onSaveRecordClick = onSaveRecord
                        )
                        1 -> HistoryScreen(
                            records = historyRecords,
                            uiState = uiState,
                            viewModel = viewModel
                        )
                        2 -> HealthTipsScreen(
                            uiState = uiState,
                            viewModel = viewModel
                        )
                        3 -> SettingsGoalsScreen(
                            uiState = uiState,
                            viewModel = viewModel
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun TopHeaderBar(
    selectedTab: Int,
    onProfileClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 20.dp, vertical = 12.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column {
            Text(
                text = "HEALTH TRACKER",
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                color = Slate500,
                letterSpacing = 1.2.sp
            )
            Spacer(modifier = Modifier.height(2.dp))
            val title = when (selectedTab) {
                0 -> "BMI Calculator"
                1 -> "Activity History"
                2 -> "Health Insights"
                else -> "Goals & Settings"
            }
            Text(
                text = title,
                fontSize = 22.sp,
                fontWeight = FontWeight.Bold,
                color = Slate800
            )
        }

        // Profile / User Avatar Button
        Box(
            modifier = Modifier
                .size(42.dp)
                .shadow(4.dp, CircleShape)
                .clip(CircleShape)
                .background(GlassSurfaceHighlight)
                .border(1.dp, GlassBorder, CircleShape)
                .clickable(onClick = onProfileClick)
                .testTag("profile_avatar_btn"),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = Icons.Default.Person,
                contentDescription = "User Profile",
                tint = Slate800,
                modifier = Modifier.size(20.dp)
            )
        }
    }
}
