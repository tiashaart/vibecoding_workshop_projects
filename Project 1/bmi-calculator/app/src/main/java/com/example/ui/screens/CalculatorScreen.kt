package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.Spacer
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
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Bookmark
import androidx.compose.material.icons.filled.Female
import androidx.compose.material.icons.filled.Male
import androidx.compose.material.icons.filled.Remove
import androidx.compose.material.icons.filled.Transgender
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Slider
import androidx.compose.material3.SliderDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.BmiUiState
import com.example.ui.BmiViewModel
import com.example.ui.Gender
import com.example.ui.UnitSystem
import com.example.ui.components.BmiCategoryScaleBar
import com.example.ui.components.CategoryBadge
import com.example.ui.components.GlassCard
import com.example.ui.components.GlassCardContent
import com.example.ui.components.GlassPill
import com.example.ui.components.QuickAdjustButton
import com.example.ui.theme.GlassBorder
import com.example.ui.theme.GlassCardBorder
import com.example.ui.theme.GlassSurface
import com.example.ui.theme.GlassSurfaceHighlight
import com.example.ui.theme.NormalBg
import com.example.ui.theme.NormalColor
import com.example.ui.theme.PrimaryIndigo
import com.example.ui.theme.Slate200
import com.example.ui.theme.Slate400
import com.example.ui.theme.Slate500
import com.example.ui.theme.Slate800
import com.example.ui.theme.Slate900

@Composable
fun CalculatorScreen(
    uiState: BmiUiState,
    viewModel: BmiViewModel,
    modifier: Modifier = Modifier,
    onSaveRecordClick: () -> Unit = {}
) {
    val scrollState = rememberScrollState()
    val currentBmi = viewModel.calculateBmi(uiState)
    val category = viewModel.getBmiCategory(currentBmi)
    val idealRange = viewModel.getIdealWeightRangeKg(uiState)

    Column(
        modifier = modifier
            .padding(horizontal = 16.dp)
            .verticalScroll(scrollState),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Spacer(modifier = Modifier.height(4.dp))

        // 1. Controls Header: Unit System & Gender & Age Selector
        GlassCard(
            testTag = "controls_header_card"
        ) {
            GlassCardContent(
                modifier = Modifier.padding(14.dp)
            ) {
                // Unit Switcher Segmented Control
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(16.dp))
                        .background(Slate200.copy(alpha = 0.5f))
                        .padding(4.dp),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    UnitTabItem(
                        title = "Metric (cm, kg)",
                        isSelected = uiState.unitSystem == UnitSystem.METRIC,
                        onClick = { viewModel.setUnitSystem(UnitSystem.METRIC) },
                        testTag = "metric_unit_tab"
                    )
                    UnitTabItem(
                        title = "Imperial (ft, lbs)",
                        isSelected = uiState.unitSystem == UnitSystem.IMPERIAL,
                        onClick = { viewModel.setUnitSystem(UnitSystem.IMPERIAL) },
                        testTag = "imperial_unit_tab"
                    )
                }

                Spacer(modifier = Modifier.height(12.dp))

                // Gender & Age Row
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    // Gender selection
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(6.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        GenderChip(
                            icon = Icons.Default.Male,
                            label = "Male",
                            isSelected = uiState.gender == Gender.MALE,
                            onClick = { viewModel.setGender(Gender.MALE) },
                            testTag = "gender_male"
                        )
                        GenderChip(
                            icon = Icons.Default.Female,
                            label = "Female",
                            isSelected = uiState.gender == Gender.FEMALE,
                            onClick = { viewModel.setGender(Gender.FEMALE) },
                            testTag = "gender_female"
                        )
                    }

                    // Age selector
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(6.dp),
                        modifier = Modifier
                            .clip(RoundedCornerShape(16.dp))
                            .background(GlassSurfaceHighlight)
                            .border(1.dp, GlassBorder, RoundedCornerShape(16.dp))
                            .padding(horizontal = 8.dp, vertical = 4.dp)
                    ) {
                        IconButton(
                            onClick = { viewModel.setAge(uiState.age - 1) },
                            modifier = Modifier.size(28.dp).testTag("age_minus_btn")
                        ) {
                            Icon(Icons.Default.Remove, contentDescription = "Decrease Age", tint = Slate800)
                        }

                        Text(
                            text = "${uiState.age} yrs",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Bold,
                            color = Slate800
                        )

                        IconButton(
                            onClick = { viewModel.setAge(uiState.age + 1) },
                            modifier = Modifier.size(28.dp).testTag("age_plus_btn")
                        ) {
                            Icon(Icons.Default.Add, contentDescription = "Increase Age", tint = Slate800)
                        }
                    }
                }
            }
        }

        // 2. BMI Main Result Glass Display Card
        GlassCard(
            testTag = "bmi_result_card"
        ) {
            // Top accent gradient bar
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(4.dp)
                    .background(
                        Brush.horizontalGradient(
                            listOf(
                                Color(0xFF38BDF8),
                                Color(0xFF34D399),
                                Color(0xFFFBBF24),
                                Color(0xFFF87171)
                            )
                        )
                    )
            )

            GlassCardContent(
                modifier = Modifier.fillMaxWidth(),
            ) {
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(
                        text = "YOUR CURRENT BMI",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = Slate500,
                        letterSpacing = 1.sp
                    )

                    Spacer(modifier = Modifier.height(4.dp))

                    Text(
                        text = "%.1f".format(currentBmi),
                        fontSize = 54.sp,
                        fontWeight = FontWeight.Black,
                        color = Slate900,
                        modifier = Modifier.testTag("bmi_score_text")
                    )

                    Spacer(modifier = Modifier.height(6.dp))

                    CategoryBadge(category = category)

                    Spacer(modifier = Modifier.height(18.dp))

                    BmiCategoryScaleBar(bmiValue = currentBmi)

                    Spacer(modifier = Modifier.height(16.dp))

                    // Ideal weight range banner
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(16.dp))
                            .background(GlassSurfaceHighlight)
                            .border(1.dp, GlassBorder, RoundedCornerShape(16.dp))
                            .padding(horizontal = 14.dp, vertical = 10.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "Healthy Weight Range",
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Medium,
                                color = Slate500
                            )

                            val rangeText = if (uiState.unitSystem == UnitSystem.METRIC) {
                                "%.1f – %.1f kg".format(idealRange.first, idealRange.second)
                            } else {
                                val minLbs = idealRange.first * 2.20462f
                                val maxLbs = idealRange.second * 2.20462f
                                "%.0f – %.0f lbs".format(minLbs, maxLbs)
                            }

                            Text(
                                text = rangeText,
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Bold,
                                color = PrimaryIndigo
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    // Quick Save Log Button
                    Button(
                        onClick = {
                            viewModel.saveCurrentBmiRecord()
                            onSaveRecordClick()
                        },
                        colors = ButtonDefaults.buttonColors(
                            containerColor = PrimaryIndigo,
                            contentColor = Color.White
                        ),
                        shape = RoundedCornerShape(16.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(44.dp)
                            .testTag("save_bmi_button")
                    ) {
                        Icon(
                            imageVector = Icons.Default.Bookmark,
                            contentDescription = null,
                            modifier = Modifier.size(18.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "Save Result to Log",
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }
        }

        // 3. Inputs: Height & Weight Adjustment Cards
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            // Height Card
            GlassCard(
                modifier = Modifier.weight(1f),
                testTag = "height_card"
            ) {
                GlassCardContent(
                    modifier = Modifier.padding(14.dp)
                ) {
                    Text(
                        text = "HEIGHT",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = Slate500,
                        letterSpacing = 1.sp
                    )

                    Spacer(modifier = Modifier.height(4.dp))

                    if (uiState.unitSystem == UnitSystem.METRIC) {
                        Row(verticalAlignment = Alignment.Bottom) {
                            Text(
                                text = "${uiState.heightCm.toInt()}",
                                fontSize = 28.sp,
                                fontWeight = FontWeight.Bold,
                                color = Slate900
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = "cm",
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Medium,
                                color = Slate400,
                                modifier = Modifier.padding(bottom = 4.dp)
                            )
                        }

                        Slider(
                            value = uiState.heightCm,
                            onValueChange = { viewModel.setHeightCm(it) },
                            valueRange = 100f..220f,
                            colors = SliderDefaults.colors(
                                thumbColor = PrimaryIndigo,
                                activeTrackColor = PrimaryIndigo,
                                inactiveTrackColor = Slate200
                            ),
                            modifier = Modifier.testTag("height_slider")
                        )

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            QuickAdjustButton(
                                label = "−",
                                onClick = { viewModel.setHeightCm(uiState.heightCm - 1f) },
                                modifier = Modifier.weight(1f),
                                testTag = "height_minus_btn"
                            )
                            QuickAdjustButton(
                                label = "+",
                                onClick = { viewModel.setHeightCm(uiState.heightCm + 1f) },
                                modifier = Modifier.weight(1f),
                                testTag = "height_plus_btn"
                            )
                        }
                    } else {
                        // Imperial FT / IN
                        Row(verticalAlignment = Alignment.Bottom) {
                            Text(
                                text = "${uiState.heightFeet}' ${uiState.heightInches}\"",
                                fontSize = 28.sp,
                                fontWeight = FontWeight.Bold,
                                color = Slate900
                            )
                        }

                        Spacer(modifier = Modifier.height(12.dp))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            QuickAdjustButton(
                                label = "−1\"",
                                onClick = {
                                    var inTotal = uiState.heightFeet * 12 + uiState.heightInches - 1
                                    if (inTotal < 36) inTotal = 36
                                    viewModel.setHeightImperial(inTotal / 12, inTotal % 12)
                                },
                                modifier = Modifier.weight(1f),
                                testTag = "height_imp_minus_btn"
                            )
                            QuickAdjustButton(
                                label = "+1\"",
                                onClick = {
                                    var inTotal = uiState.heightFeet * 12 + uiState.heightInches + 1
                                    if (inTotal > 84) inTotal = 84
                                    viewModel.setHeightImperial(inTotal / 12, inTotal % 12)
                                },
                                modifier = Modifier.weight(1f),
                                testTag = "height_imp_plus_btn"
                            )
                        }
                    }
                }
            }

            // Weight Card
            GlassCard(
                modifier = Modifier.weight(1f),
                testTag = "weight_card"
            ) {
                GlassCardContent(
                    modifier = Modifier.padding(14.dp)
                ) {
                    Text(
                        text = "WEIGHT",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = Slate500,
                        letterSpacing = 1.sp
                    )

                    Spacer(modifier = Modifier.height(4.dp))

                    if (uiState.unitSystem == UnitSystem.METRIC) {
                        Row(verticalAlignment = Alignment.Bottom) {
                            Text(
                                text = "%.1f".format(uiState.weightKg),
                                fontSize = 28.sp,
                                fontWeight = FontWeight.Bold,
                                color = Slate900
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = "kg",
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Medium,
                                color = Slate400,
                                modifier = Modifier.padding(bottom = 4.dp)
                            )
                        }

                        Slider(
                            value = uiState.weightKg,
                            onValueChange = { viewModel.setWeightKg(it) },
                            valueRange = 30f..180f,
                            colors = SliderDefaults.colors(
                                thumbColor = PrimaryIndigo,
                                activeTrackColor = PrimaryIndigo,
                                inactiveTrackColor = Slate200
                            ),
                            modifier = Modifier.testTag("weight_slider")
                        )

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            QuickAdjustButton(
                                label = "−",
                                onClick = { viewModel.setWeightKg(uiState.weightKg - 0.5f) },
                                modifier = Modifier.weight(1f),
                                testTag = "weight_minus_btn"
                            )
                            QuickAdjustButton(
                                label = "+",
                                onClick = { viewModel.setWeightKg(uiState.weightKg + 0.5f) },
                                modifier = Modifier.weight(1f),
                                testTag = "weight_plus_btn"
                            )
                        }
                    } else {
                        Row(verticalAlignment = Alignment.Bottom) {
                            Text(
                                text = "%.1f".format(uiState.weightLbs),
                                fontSize = 28.sp,
                                fontWeight = FontWeight.Bold,
                                color = Slate900
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = "lbs",
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Medium,
                                color = Slate400,
                                modifier = Modifier.padding(bottom = 4.dp)
                            )
                        }

                        Slider(
                            value = uiState.weightLbs,
                            onValueChange = { viewModel.setWeightLbs(it) },
                            valueRange = 60f..400f,
                            colors = SliderDefaults.colors(
                                thumbColor = PrimaryIndigo,
                                activeTrackColor = PrimaryIndigo,
                                inactiveTrackColor = Slate200
                            ),
                            modifier = Modifier.testTag("weight_lbs_slider")
                        )

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            QuickAdjustButton(
                                label = "−",
                                onClick = { viewModel.setWeightLbs(uiState.weightLbs - 1.0f) },
                                modifier = Modifier.weight(1f),
                                testTag = "weight_lbs_minus_btn"
                            )
                            QuickAdjustButton(
                                label = "+",
                                onClick = { viewModel.setWeightLbs(uiState.weightLbs + 1.0f) },
                                modifier = Modifier.weight(1f),
                                testTag = "weight_lbs_plus_btn"
                            )
                        }
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(24.dp))
    }
}

@Composable
private fun RowScope.UnitTabItem(
    title: String,
    isSelected: Boolean,
    onClick: () -> Unit,
    testTag: String
) {
    Box(
        modifier = Modifier
            .weight(1f)
            .testTag(testTag)
            .clip(RoundedCornerShape(12.dp))
            .background(if (isSelected) GlassSurfaceHighlight else Color.Transparent)
            .clickable(onClick = onClick)
            .padding(vertical = 8.dp),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = title,
            fontSize = 12.sp,
            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
            color = if (isSelected) PrimaryIndigo else Slate500
        )
    }
}

@Composable
private fun GenderChip(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    label: String,
    isSelected: Boolean,
    onClick: () -> Unit,
    testTag: String
) {
    val bg = if (isSelected) PrimaryIndigo else GlassSurfaceHighlight
    val contentColor = if (isSelected) Color.White else Slate800

    Row(
        modifier = Modifier
            .testTag(testTag)
            .clip(RoundedCornerShape(16.dp))
            .background(bg)
            .border(1.dp, if (isSelected) PrimaryIndigo else GlassBorder, RoundedCornerShape(16.dp))
            .clickable(onClick = onClick)
            .padding(horizontal = 12.dp, vertical = 6.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(4.dp)
    ) {
        Icon(
            imageVector = icon,
            contentDescription = label,
            tint = contentColor,
            modifier = Modifier.size(16.dp)
        )
        Text(
            text = label,
            fontSize = 12.sp,
            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
            color = contentColor
        )
    }
}
