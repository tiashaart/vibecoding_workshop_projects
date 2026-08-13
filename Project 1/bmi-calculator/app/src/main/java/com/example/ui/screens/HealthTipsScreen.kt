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
import androidx.compose.material.icons.filled.DirectionsRun
import androidx.compose.material.icons.filled.LocalDrink
import androidx.compose.material.icons.filled.LocalFireDepartment
import androidx.compose.material.icons.filled.Restaurant
import androidx.compose.material.icons.filled.SelfImprovement
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.BmiCategory
import com.example.ui.BmiUiState
import com.example.ui.BmiViewModel
import com.example.ui.Gender
import com.example.ui.components.CategoryBadge
import com.example.ui.components.GlassCard
import com.example.ui.components.GlassCardContent
import com.example.ui.theme.GlassBorder
import com.example.ui.theme.GlassSurfaceHighlight
import com.example.ui.theme.NormalBg
import com.example.ui.theme.NormalColor
import com.example.ui.theme.PrimaryIndigo
import com.example.ui.theme.SecondaryBlue
import com.example.ui.theme.Slate400
import com.example.ui.theme.Slate500
import com.example.ui.theme.Slate800
import com.example.ui.theme.Slate900

@Composable
fun HealthTipsScreen(
    uiState: BmiUiState,
    viewModel: BmiViewModel,
    modifier: Modifier = Modifier
) {
    val scrollState = rememberScrollState()
    val bmi = viewModel.calculateBmi(uiState)
    val category = viewModel.getBmiCategory(bmi)

    // Calculate estimated daily water requirement (~35 ml per kg)
    val waterLiters = (uiState.weightKg * 0.035f * 10).toInt() / 10f

    // Estimated BMR using Mifflin-St Jeor Formula
    val bmr = if (uiState.gender == Gender.MALE) {
        (10 * uiState.weightKg + 6.25 * uiState.heightCm - 5 * uiState.age + 5).toInt()
    } else {
        (10 * uiState.weightKg + 6.25 * uiState.heightCm - 5 * uiState.age - 161).toInt()
    }

    Column(
        modifier = modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp)
            .verticalScroll(scrollState),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Spacer(modifier = Modifier.height(4.dp))

        // Banner Card
        GlassCard(testTag = "health_banner_card") {
            GlassCardContent(modifier = Modifier.padding(16.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = "HEALTH & DIET GUIDE",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = Slate500,
                            letterSpacing = 1.sp
                        )
                        Spacer(modifier = Modifier.height(2.dp))
                        Text(
                            text = "Personalized Insights",
                            fontSize = 20.sp,
                            fontWeight = FontWeight.Bold,
                            color = Slate900
                        )
                        Text(
                            text = "Based on your BMI of %.1f".format(bmi),
                            fontSize = 12.sp,
                            color = Slate500
                        )
                    }
                    CategoryBadge(category = category)
                }
            }
        }

        // Quick Stats Row (Water intake & Caloric estimate)
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            // Water Intake Card
            GlassCard(
                modifier = Modifier.weight(1f),
                testTag = "water_card"
            ) {
                GlassCardContent(modifier = Modifier.padding(14.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(36.dp)
                                .clip(CircleShape)
                                .background(Color(0xFFE0F2FE)),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Default.LocalDrink,
                                contentDescription = null,
                                tint = SecondaryBlue,
                                modifier = Modifier.size(20.dp)
                            )
                        }
                        Spacer(modifier = Modifier.width(10.dp))
                        Column {
                            Text(
                                text = "Daily Water",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = Slate500
                            )
                            Text(
                                text = "%.1f L".format(waterLiters),
                                fontSize = 18.sp,
                                fontWeight = FontWeight.Bold,
                                color = Slate900
                            )
                        }
                    }
                }
            }

            // BMR Calories Card
            GlassCard(
                modifier = Modifier.weight(1f),
                testTag = "calories_card"
            ) {
                GlassCardContent(modifier = Modifier.padding(14.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(36.dp)
                                .clip(CircleShape)
                                .background(Color(0xFFFEF3C7)),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Default.LocalFireDepartment,
                                contentDescription = null,
                                tint = Color(0xFFD97706),
                                modifier = Modifier.size(20.dp)
                            )
                        }
                        Spacer(modifier = Modifier.width(10.dp))
                        Column {
                            Text(
                                text = "Base Metabolism",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = Slate500
                            )
                            Text(
                                text = "$bmr kcal",
                                fontSize = 18.sp,
                                fontWeight = FontWeight.Bold,
                                color = Slate900
                            )
                        }
                    }
                }
            }
        }

        // Actionable Tips Category Cards
        val (dietTip, workoutTip) = when (category) {
            BmiCategory.UNDERWEIGHT -> Pair(
                "Focus on nutrient-dense calorie surplus: include healthy fats (avocados, nuts, olive oil), complex carbohydrates, and lean proteins (eggs, chicken, lentils). Consume small meals every 3 hours.",
                "Prioritize resistance and strength training 3-4 times per week to build lean muscle mass. Limit excessive high-intensity cardio sessions."
            )
            BmiCategory.NORMAL -> Pair(
                "Maintain a balanced diet with a variety of colorful vegetables, fiber, healthy fats, and whole grains. Keep portion sizes consistent to maintain your optimal weight.",
                "Aim for at least 150 minutes of moderate aerobic activity per week, paired with 2-3 days of strength exercises for cardiorespiratory fitness."
            )
            BmiCategory.OVERWEIGHT -> Pair(
                "Create a gentle caloric deficit (~300-500 kcal/day). Replace refined sugars and processed snacks with whole foods, leafy greens, and lean protein to stay satiated.",
                "Combine brisk walking, cycling, or swimming with compound bodyweight or weight exercises. Aim for 30-45 minutes of daily activity."
            )
            BmiCategory.OBESE -> Pair(
                "Focus on sustained habit changes: reduce sugary beverages, increase dietary fiber and protein, and practice mindful eating. Seek professional dietary guidance if appropriate.",
                "Start with low-impact cardiovascular exercises like walking, water aerobics, or stationary cycling to protect joints while boosting caloric expenditure."
            )
        }

        TipDetailCard(
            title = "Nutrition & Diet Advice",
            description = dietTip,
            icon = Icons.Default.Restaurant,
            iconBg = NormalBg,
            iconColor = NormalColor,
            testTag = "diet_tip_card"
        )

        TipDetailCard(
            title = "Exercise & Fitness Plan",
            description = workoutTip,
            icon = Icons.Default.DirectionsRun,
            iconBg = Color(0xFFE0F2FE),
            iconColor = SecondaryBlue,
            testTag = "workout_tip_card"
        )

        TipDetailCard(
            title = "Mindset & Sleep Hygiene",
            description = "Prioritize 7–9 hours of quality sleep nightly. Sleep deprivation elevates cortisol and ghrelin, increasing appetite and body fat storage.",
            icon = Icons.Default.SelfImprovement,
            iconBg = Color(0xFFEEF2FF),
            iconColor = PrimaryIndigo,
            testTag = "mindset_tip_card"
        )

        Spacer(modifier = Modifier.height(80.dp))
    }
}

@Composable
private fun TipDetailCard(
    title: String,
    description: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    iconBg: Color,
    iconColor: Color,
    testTag: String
) {
    GlassCard(testTag = testTag) {
        GlassCardContent(modifier = Modifier.padding(16.dp)) {
            Row(
                verticalAlignment = Alignment.Top,
                horizontalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                Box(
                    modifier = Modifier
                        .size(44.dp)
                        .clip(CircleShape)
                        .background(iconBg)
                        .border(1.dp, iconColor.copy(alpha = 0.3f), CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = icon,
                        contentDescription = null,
                        tint = iconColor,
                        modifier = Modifier.size(22.dp)
                    )
                }

                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = title,
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold,
                        color = Slate900
                    )

                    Spacer(modifier = Modifier.height(4.dp))

                    Text(
                        text = description,
                        fontSize = 13.sp,
                        color = Slate800,
                        lineHeight = 18.sp
                    )
                }
            }
        }
    }
}
