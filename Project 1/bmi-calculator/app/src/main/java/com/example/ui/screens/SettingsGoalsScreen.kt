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
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Flag
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Straighten
import androidx.compose.material.icons.filled.Tune
import androidx.compose.material3.Icon
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.Slider
import androidx.compose.material3.SliderDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.BmiUiState
import com.example.ui.BmiViewModel
import com.example.ui.UnitSystem
import com.example.ui.components.GlassCard
import com.example.ui.components.GlassCardContent
import com.example.ui.components.QuickAdjustButton
import com.example.ui.theme.GlassBorder
import com.example.ui.theme.GlassSurfaceHighlight
import com.example.ui.theme.NormalColor
import com.example.ui.theme.ObeseColor
import com.example.ui.theme.OverweightColor
import com.example.ui.theme.PrimaryIndigo
import com.example.ui.theme.Slate200
import com.example.ui.theme.Slate400
import com.example.ui.theme.Slate500
import com.example.ui.theme.Slate800
import com.example.ui.theme.Slate900
import com.example.ui.theme.UnderweightColor
import kotlin.math.abs

@Composable
fun SettingsGoalsScreen(
    uiState: BmiUiState,
    viewModel: BmiViewModel,
    modifier: Modifier = Modifier
) {
    val scrollState = rememberScrollState()

    val currentWeightKg = uiState.weightKg
    val targetWeightKg = uiState.targetWeightKg
    val diffKg = targetWeightKg - currentWeightKg

    Column(
        modifier = modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp)
            .verticalScroll(scrollState),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Spacer(modifier = Modifier.height(4.dp))

        // 1. Target Weight Goal Card
        GlassCard(testTag = "target_goal_card") {
            GlassCardContent(modifier = Modifier.padding(16.dp)) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .size(42.dp)
                            .clip(CircleShape)
                            .background(Color(0xFFEEF2FF)),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.Flag,
                            contentDescription = null,
                            tint = PrimaryIndigo,
                            modifier = Modifier.size(22.dp)
                        )
                    }

                    Column {
                        Text(
                            text = "TARGET WEIGHT GOAL",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = Slate500,
                            letterSpacing = 1.sp
                        )
                        Text(
                            text = "Set Your Ideal Weight",
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold,
                            color = Slate900
                        )
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.Bottom
                ) {
                    Column {
                        Text(text = "Current Weight", fontSize = 12.sp, color = Slate500)
                        val currStr = if (uiState.unitSystem == UnitSystem.METRIC) {
                            "%.1f kg".format(currentWeightKg)
                        } else {
                            "%.1f lbs".format(currentWeightKg * 2.20462f)
                        }
                        Text(
                            text = currStr,
                            fontSize = 20.sp,
                            fontWeight = FontWeight.Bold,
                            color = Slate800
                        )
                    }

                    Column(horizontalAlignment = Alignment.End) {
                        Text(text = "Target Goal", fontSize = 12.sp, color = Slate500)
                        val targetStr = if (uiState.unitSystem == UnitSystem.METRIC) {
                            "%.1f kg".format(targetWeightKg)
                        } else {
                            "%.1f lbs".format(targetWeightKg * 2.20462f)
                        }
                        Text(
                            text = targetStr,
                            fontSize = 20.sp,
                            fontWeight = FontWeight.Bold,
                            color = PrimaryIndigo
                        )
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                Slider(
                    value = targetWeightKg,
                    onValueChange = { viewModel.setTargetWeightKg(it) },
                    valueRange = 30f..150f,
                    colors = SliderDefaults.colors(
                        thumbColor = PrimaryIndigo,
                        activeTrackColor = PrimaryIndigo,
                        inactiveTrackColor = Slate200
                    ),
                    modifier = Modifier.testTag("target_weight_slider")
                )

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    QuickAdjustButton(
                        label = "−1 kg",
                        onClick = { viewModel.setTargetWeightKg(targetWeightKg - 1f) },
                        modifier = Modifier.weight(1f),
                        testTag = "target_minus_btn"
                    )
                    QuickAdjustButton(
                        label = "+1 kg",
                        onClick = { viewModel.setTargetWeightKg(targetWeightKg + 1f) },
                        modifier = Modifier.weight(1f),
                        testTag = "target_plus_btn"
                    )
                }

                Spacer(modifier = Modifier.height(14.dp))

                // Difference summary pill
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(16.dp))
                        .background(GlassSurfaceHighlight)
                        .border(1.dp, GlassBorder, RoundedCornerShape(16.dp))
                        .padding(horizontal = 14.dp, vertical = 10.dp)
                ) {
                    val diffStr = if (diffKg == 0f) {
                        "Target reached! You are at your goal weight."
                    } else if (diffKg < 0f) {
                        val amount = if (uiState.unitSystem == UnitSystem.METRIC) {
                            "%.1f kg".format(abs(diffKg))
                        } else {
                            "%.1f lbs".format(abs(diffKg) * 2.20462f)
                        }
                        "Need to lose $amount to reach your goal"
                    } else {
                        val amount = if (uiState.unitSystem == UnitSystem.METRIC) {
                            "%.1f kg".format(diffKg)
                        } else {
                            "%.1f lbs".format(diffKg * 2.20462f)
                        }
                        "Need to gain $amount to reach your goal"
                    }

                    Text(
                        text = diffStr,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        color = PrimaryIndigo
                    )
                }
            }
        }

        // 2. BMI Classification Reference Sheet
        GlassCard(testTag = "bmi_reference_card") {
            GlassCardContent(modifier = Modifier.padding(16.dp)) {
                Text(
                    text = "BMI CATEGORY RANGES",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    color = Slate500,
                    letterSpacing = 1.sp
                )
                Spacer(modifier = Modifier.height(12.dp))

                CategoryRangeRow("Underweight", "< 18.5", UnderweightColor)
                CategoryRangeRow("Normal Weight", "18.5 – 24.9", NormalColor)
                CategoryRangeRow("Overweight", "25.0 – 29.9", OverweightColor)
                CategoryRangeRow("Obese Class", "≥ 30.0", ObeseColor)
            }
        }

        // 3. Formula & App Details
        GlassCard(testTag = "app_info_card") {
            GlassCardContent(modifier = Modifier.padding(16.dp)) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.Info,
                        contentDescription = null,
                        tint = Slate500,
                        modifier = Modifier.size(20.dp)
                    )
                    Text(
                        text = "About BMI Calculation",
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold,
                        color = Slate900
                    )
                }

                Spacer(modifier = Modifier.height(8.dp))

                Text(
                    text = "Body Mass Index (BMI) is a standardized screening metric calculated using weight in kilograms divided by height in meters squared (BMI = kg/m²).\n\n" +
                            "While useful for population health assessment, individual muscle mass, bone density, and age should also be considered.",
                    fontSize = 12.sp,
                    color = Slate500,
                    lineHeight = 17.sp
                )
            }
        }

        Spacer(modifier = Modifier.height(80.dp))
    }
}

@Composable
private fun CategoryRangeRow(
    title: String,
    rangeStr: String,
    accentColor: Color
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 6.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(12.dp)
                    .clip(CircleShape)
                    .background(accentColor)
            )
            Text(
                text = title,
                fontSize = 13.sp,
                fontWeight = FontWeight.Medium,
                color = Slate800
            )
        }

        Text(
            text = rangeStr,
            fontSize = 13.sp,
            fontWeight = FontWeight.Bold,
            color = Slate800
        )
    }
}
