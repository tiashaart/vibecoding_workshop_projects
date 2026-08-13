package com.example.ui.components

import androidx.compose.animation.animateColorAsState
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Assessment
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.RestaurantMenu
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.material3.ripple
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.theme.GlassBorder
import com.example.ui.theme.GlassCanvasBg
import com.example.ui.theme.GlassSurfaceHighlight
import com.example.ui.theme.PrimaryIndigo
import com.example.ui.theme.Slate400
import com.example.ui.theme.Slate500

@Composable
fun GlassNavigationBar(
    selectedTab: Int,
    onTabSelected: (Int) -> Unit,
    onFabClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .fillMaxWidth()
            .testTag("glass_navigation_bar"),
        contentAlignment = Alignment.BottomCenter
    ) {
        // Frosted Glass Bar Container
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(76.dp)
                .shadow(
                    elevation = 16.dp,
                    shape = RoundedCornerShape(topStart = 32.dp, topEnd = 32.dp),
                    ambientColor = Color(0x22000000)
                )
                .clip(RoundedCornerShape(topStart = 32.dp, topEnd = 32.dp))
                .background(Color(0xDCFFFFFF))
                .border(
                    width = 1.dp,
                    color = GlassBorder,
                    shape = RoundedCornerShape(topStart = 32.dp, topEnd = 32.dp)
                )
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(76.dp)
                    .padding(horizontal = 12.dp),
                horizontalArrangement = Arrangement.SpaceAround,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Tab 0: Calculator / Home
                NavTabItem(
                    icon = Icons.Default.Home,
                    label = "Dashboard",
                    isSelected = selectedTab == 0,
                    onClick = { onTabSelected(0) },
                    testTag = "nav_tab_dashboard"
                )

                // Tab 1: History
                NavTabItem(
                    icon = Icons.Default.Assessment,
                    label = "History",
                    isSelected = selectedTab == 1,
                    onClick = { onTabSelected(1) },
                    testTag = "nav_tab_history"
                )

                // Center Spacer for Floating Center Button
                Spacer(modifier = Modifier.size(52.dp))

                // Tab 2: Health Tips / Diet
                NavTabItem(
                    icon = Icons.Default.RestaurantMenu,
                    label = "Diet & Tips",
                    isSelected = selectedTab == 2,
                    onClick = { onTabSelected(2) },
                    testTag = "nav_tab_tips"
                )

                // Tab 3: Goals / Settings
                NavTabItem(
                    icon = Icons.Default.Settings,
                    label = "Goals",
                    isSelected = selectedTab == 3,
                    onClick = { onTabSelected(3) },
                    testTag = "nav_tab_goals"
                )
            }
        }

        // Center Floating Action Button (+)
        Box(
            modifier = Modifier
                .offset(y = (-24).dp)
                .size(56.dp)
                .shadow(12.dp, CircleShape, spotColor = PrimaryIndigo.copy(alpha = 0.4f))
                .clip(CircleShape)
                .background(PrimaryIndigo)
                .border(4.dp, GlassCanvasBg, CircleShape)
                .clickable(
                    onClick = onFabClick,
                    interactionSource = remember { MutableInteractionSource() },
                    indication = ripple()
                )
                .testTag("center_fab_button"),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = Icons.Default.Add,
                contentDescription = "Quick Add / Save",
                tint = Color.White,
                modifier = Modifier.size(28.dp)
            )
        }
    }
}

@Composable
private fun NavTabItem(
    icon: ImageVector,
    label: String,
    isSelected: Boolean,
    onClick: () -> Unit,
    testTag: String
) {
    val color by animateColorAsState(
        targetValue = if (isSelected) PrimaryIndigo else Slate400,
        label = "navTabColor"
    )

    Column(
        modifier = Modifier
            .testTag(testTag)
            .clip(RoundedCornerShape(16.dp))
            .clickable(onClick = onClick)
            .padding(horizontal = 10.dp, vertical = 6.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Icon(
            imageVector = icon,
            contentDescription = label,
            tint = color,
            modifier = Modifier.size(22.dp)
        )
        Spacer(modifier = Modifier.height(2.dp))
        Text(
            text = label,
            fontSize = 10.sp,
            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
            color = color
        )
    }
}
