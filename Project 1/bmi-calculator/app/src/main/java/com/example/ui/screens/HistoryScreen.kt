package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
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
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.DeleteSweep
import androidx.compose.material.icons.filled.History
import androidx.compose.material.icons.filled.TrendingDown
import androidx.compose.material.icons.filled.TrendingFlat
import androidx.compose.material.icons.filled.TrendingUp
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.BmiRecord
import com.example.ui.BmiCategory
import com.example.ui.BmiUiState
import com.example.ui.BmiViewModel
import com.example.ui.UnitSystem
import com.example.ui.components.CategoryBadge
import com.example.ui.components.GlassCard
import com.example.ui.components.GlassCardContent
import com.example.ui.theme.GlassBorder
import com.example.ui.theme.GlassSurfaceHighlight
import com.example.ui.theme.NormalBg
import com.example.ui.theme.NormalColor
import com.example.ui.theme.ObeseBg
import com.example.ui.theme.ObeseColor
import com.example.ui.theme.OverweightBg
import com.example.ui.theme.OverweightColor
import com.example.ui.theme.PrimaryIndigo
import com.example.ui.theme.Slate400
import com.example.ui.theme.Slate500
import com.example.ui.theme.Slate800
import com.example.ui.theme.Slate900

@Composable
fun HistoryScreen(
    records: List<BmiRecord>,
    uiState: BmiUiState,
    viewModel: BmiViewModel,
    modifier: Modifier = Modifier
) {
    var showClearConfirmDialog by remember { mutableStateOf(false) }

    if (showClearConfirmDialog) {
        AlertDialog(
            onDismissRequest = { showClearConfirmDialog = false },
            title = { Text("Clear All History", fontWeight = FontWeight.Bold) },
            text = { Text("Are you sure you want to delete all saved BMI records? This action cannot be undone.") },
            confirmButton = {
                TextButton(
                    onClick = {
                        viewModel.clearAllRecords()
                        showClearConfirmDialog = false
                    }
                ) {
                    Text("Delete All", color = ObeseColor, fontWeight = FontWeight.Bold)
                }
            },
            dismissButton = {
                TextButton(onClick = { showClearConfirmDialog = false }) {
                    Text("Cancel", color = Slate800)
                }
            }
        )
    }

    Column(
        modifier = modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp)
    ) {
        // Header Row
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 8.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = "Activity History",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = Slate900
                )
                Text(
                    text = "${records.size} records saved",
                    fontSize = 12.sp,
                    color = Slate500
                )
            }

            if (records.isNotEmpty()) {
                IconButton(
                    onClick = { showClearConfirmDialog = true },
                    modifier = Modifier.testTag("clear_history_btn")
                ) {
                    Icon(
                        imageVector = Icons.Default.DeleteSweep,
                        contentDescription = "Clear History",
                        tint = ObeseColor
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(8.dp))

        if (records.isEmpty()) {
            GlassCard(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 32.dp),
                testTag = "empty_history_card"
            ) {
                GlassCardContent(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(32.dp)
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Box(
                            modifier = Modifier
                                .size(64.dp)
                                .clip(CircleShape)
                                .background(GlassSurfaceHighlight)
                                .border(1.dp, GlassBorder, CircleShape),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Default.History,
                                contentDescription = null,
                                tint = PrimaryIndigo,
                                modifier = Modifier.size(32.dp)
                            )
                        }

                        Spacer(modifier = Modifier.height(16.dp))

                        Text(
                            text = "No Saved History Yet",
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold,
                            color = Slate800
                        )

                        Spacer(modifier = Modifier.height(6.dp))

                        Text(
                            text = "Calculate your BMI on the Calculator tab and tap 'Save Result' to track your progress over time.",
                            fontSize = 13.sp,
                            color = Slate500,
                            modifier = Modifier.padding(horizontal = 16.dp)
                        )
                    }
                }
            }
        } else {
            LazyColumn(
                verticalArrangement = Arrangement.spacedBy(10.dp),
                modifier = Modifier.fillMaxSize()
            ) {
                itemsIndexed(records, key = { _, record -> record.id }) { index, record ->
                    val prevRecord = if (index + 1 < records.size) records[index + 1] else null
                    BmiRecordItem(
                        record = record,
                        prevRecord = prevRecord,
                        uiState = uiState,
                        viewModel = viewModel,
                        onDeleteClick = { viewModel.deleteRecord(record) }
                    )
                }
                item {
                    Spacer(modifier = Modifier.height(80.dp))
                }
            }
        }
    }
}

@Composable
private fun BmiRecordItem(
    record: BmiRecord,
    prevRecord: BmiRecord?,
    uiState: BmiUiState,
    viewModel: BmiViewModel,
    onDeleteClick: () -> Unit
) {
    val category = when (record.categoryName) {
        "Underweight" -> BmiCategory.UNDERWEIGHT
        "Normal Weight" -> BmiCategory.NORMAL
        "Overweight" -> BmiCategory.OVERWEIGHT
        else -> BmiCategory.OBESE
    }

    GlassCard(
        testTag = "record_item_${record.id}"
    ) {
        GlassCardContent(
            modifier = Modifier.padding(14.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    // Trend icon container
                    val diffKg = if (prevRecord != null) record.weightKg - prevRecord.weightKg else 0f
                    val (icon, iconBg, iconColor) = when {
                        prevRecord == null -> Triple(Icons.Default.TrendingFlat, GlassSurfaceHighlight, Slate500)
                        diffKg < 0f -> Triple(Icons.Default.TrendingDown, NormalBg, NormalColor)
                        diffKg > 0f -> Triple(Icons.Default.TrendingUp, OverweightBg, OverweightColor)
                        else -> Triple(Icons.Default.TrendingFlat, GlassSurfaceHighlight, Slate500)
                    }

                    Box(
                        modifier = Modifier
                            .size(40.dp)
                            .clip(CircleShape)
                            .background(iconBg)
                            .border(1.dp, iconColor.copy(alpha = 0.3f), CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = icon,
                            contentDescription = null,
                            tint = iconColor,
                            modifier = Modifier.size(20.dp)
                        )
                    }

                    Column {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            val weightStr = if (uiState.unitSystem == UnitSystem.METRIC) {
                                "%.1f kg".format(record.weightKg)
                            } else {
                                "%.1f lbs".format(record.weightKg * 2.20462f)
                            }
                            Text(
                                text = weightStr,
                                fontSize = 15.sp,
                                fontWeight = FontWeight.Bold,
                                color = Slate900
                            )

                            if (prevRecord != null && diffKg != 0f) {
                                Spacer(modifier = Modifier.width(8.dp))
                                val diffStr = if (uiState.unitSystem == UnitSystem.METRIC) {
                                    "%+.1f kg".format(diffKg)
                                } else {
                                    "%+.1f lbs".format(diffKg * 2.20462f)
                                }
                                Text(
                                    text = diffStr,
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = iconColor
                                )
                            }
                        }

                        Text(
                            text = viewModel.formatDate(record.timestamp),
                            fontSize = 11.sp,
                            color = Slate400
                        )
                    }
                }

                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Column(horizontalAlignment = Alignment.End) {
                        Text(
                            text = "BMI %.1f".format(record.bmiValue),
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold,
                            color = Slate800
                        )
                        CategoryBadge(category = category)
                    }

                    IconButton(
                        onClick = onDeleteClick,
                        modifier = Modifier.size(28.dp).testTag("delete_record_${record.id}")
                    ) {
                        Icon(
                            imageVector = Icons.Default.Delete,
                            contentDescription = "Delete record",
                            tint = Slate400,
                            modifier = Modifier.size(16.dp)
                        )
                    }
                }
            }
        }
    }
}
