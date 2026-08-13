package com.example.ui.components

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxScope
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.ripple
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Shape
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.BmiCategory
import com.example.ui.theme.GlassBorder
import com.example.ui.theme.GlassCanvasBg
import com.example.ui.theme.GlassCardBorder
import com.example.ui.theme.GlassSurface
import com.example.ui.theme.GlassSurfaceHighlight
import com.example.ui.theme.NormalBg
import com.example.ui.theme.NormalColor
import com.example.ui.theme.ObeseBg
import com.example.ui.theme.ObeseColor
import com.example.ui.theme.OverweightBg
import com.example.ui.theme.OverweightColor
import com.example.ui.theme.PrimaryIndigo
import com.example.ui.theme.Slate200
import com.example.ui.theme.Slate400
import com.example.ui.theme.Slate500
import com.example.ui.theme.Slate800
import com.example.ui.theme.UnderweightBg
import com.example.ui.theme.UnderweightColor

@Composable
fun GlassCanvasBackground(
    content: @Composable BoxScope.() -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(GlassCanvasBg)
    ) {
        // Soft glowing radial background circles simulating blur or gradients
        Canvas(modifier = Modifier.fillMaxSize()) {
            // Top-left soft indigo halo
            drawCircle(
                brush = Brush.radialGradient(
                    colors = listOf(
                        Color(0x33818CF8),
                        Color(0x11C084FC),
                        Color.Transparent
                    ),
                    center = Offset(size.width * 0.1f, size.height * 0.15f),
                    radius = size.width * 0.8f
                )
            )
            // Bottom-right soft sky blue halo
            drawCircle(
                brush = Brush.radialGradient(
                    colors = listOf(
                        Color(0x3338BDF8),
                        Color(0x1134D399),
                        Color.Transparent
                    ),
                    center = Offset(size.width * 0.9f, size.height * 0.85f),
                    radius = size.width * 0.75f
                )
            )
        }
        content()
    }
}

@Composable
fun GlassCard(
    modifier: Modifier = Modifier,
    shape: Shape = RoundedCornerShape(28.dp),
    backgroundColor: Color = GlassSurface,
    borderColor: Color = GlassCardBorder,
    elevation: Dp = 6.dp,
    testTag: String = "glass_card",
    content: @Composable ColumnScope.() -> Unit
) {
    Box(
        modifier = modifier
            .testTag(testTag)
            .shadow(
                elevation = elevation,
                shape = shape,
                ambientColor = Color(0x1A000000),
                spotColor = Color(0x11000000)
            )
            .clip(shape)
            .background(backgroundColor)
            .border(width = 1.dp, color = borderColor, shape = shape)
    ) {
        Column {
            content()
        }
    }
}

@Composable
fun ColumnScope.GlassCardContent(
    modifier: Modifier = Modifier,
    content: @Composable ColumnScope.() -> Unit
) {
    Column(
        modifier = modifier.padding(20.dp),
        content = content
    )
}

@Composable
fun GlassPill(
    text: String,
    isSelected: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    testTag: String = "glass_pill"
) {
    val bg = if (isSelected) PrimaryIndigo else GlassSurfaceHighlight
    val textColor = if (isSelected) Color.White else Slate800
    val border = if (isSelected) PrimaryIndigo else GlassBorder

    Box(
        modifier = modifier
            .testTag(testTag)
            .clip(RoundedCornerShape(20.dp))
            .background(bg)
            .border(1.dp, border, RoundedCornerShape(20.dp))
            .clickable(onClick = onClick)
            .padding(horizontal = 16.dp, vertical = 8.dp),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = text,
            fontSize = 13.sp,
            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
            color = textColor
        )
    }
}

@Composable
fun CategoryBadge(
    category: BmiCategory,
    modifier: Modifier = Modifier
) {
    val (bgColor, textColor) = when (category) {
        BmiCategory.UNDERWEIGHT -> Pair(UnderweightBg, UnderweightColor)
        BmiCategory.NORMAL -> Pair(NormalBg, NormalColor)
        BmiCategory.OVERWEIGHT -> Pair(OverweightBg, OverweightColor)
        BmiCategory.OBESE -> Pair(ObeseBg, ObeseColor)
    }

    Box(
        modifier = modifier
            .clip(RoundedCornerShape(20.dp))
            .background(bgColor)
            .border(1.dp, textColor.copy(alpha = 0.3f), RoundedCornerShape(20.dp))
            .padding(horizontal = 16.dp, vertical = 6.dp)
    ) {
        Text(
            text = category.label,
            fontSize = 13.sp,
            fontWeight = FontWeight.Bold,
            color = textColor
        )
    }
}

@Composable
fun QuickAdjustButton(
    label: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    testTag: String = "adjust_button"
) {
    Box(
        modifier = modifier
            .testTag(testTag)
            .height(42.dp)
            .clip(RoundedCornerShape(14.dp))
            .background(GlassSurfaceHighlight)
            .border(1.dp, GlassBorder, RoundedCornerShape(14.dp))
            .clickable(
                onClick = onClick,
                interactionSource = remember { MutableInteractionSource() },
                indication = ripple()
            ),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = label,
            fontSize = 18.sp,
            fontWeight = FontWeight.Bold,
            color = Slate800
        )
    }
}

@Composable
fun BmiCategoryScaleBar(
    bmiValue: Float,
    modifier: Modifier = Modifier
) {
    // Range roughly 15.0 to 35.0 for progress calculations
    val clampedBmi = bmiValue.coerceIn(15.0f, 35.0f)
    val animatedProgress by animateFloatAsState(
        targetValue = (clampedBmi - 15.0f) / 20.0f,
        animationSpec = tween(durationMillis = 600),
        label = "bmiProgress"
    )

    Column(modifier = modifier.fillMaxWidth()) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            ScaleSegmentLabel("UNDER", bmiValue in 0f..18.49f, UnderweightColor)
            ScaleSegmentLabel("NORMAL", bmiValue in 18.5f..24.99f, NormalColor)
            ScaleSegmentLabel("OVER", bmiValue in 25.0f..29.99f, OverweightColor)
            ScaleSegmentLabel("OBESE", bmiValue >= 30.0f, ObeseColor)
        }

        Spacer(modifier = Modifier.height(6.dp))

        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(10.dp)
                .clip(RoundedCornerShape(5.dp))
                .background(Slate200)
        ) {
            Row(modifier = Modifier.fillMaxSize()) {
                Box(modifier = Modifier.weight(0.175f).fillMaxSize().background(UnderweightColor))
                Box(modifier = Modifier.weight(0.32f).fillMaxSize().background(NormalColor))
                Box(modifier = Modifier.weight(0.25f).fillMaxSize().background(OverweightColor))
                Box(modifier = Modifier.weight(0.255f).fillMaxSize().background(ObeseColor))
            }

            // Indicator pointer position
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(horizontal = 2.dp),
                contentAlignment = Alignment.CenterStart
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth(animatedProgress.coerceIn(0.02f, 0.98f))
                ) {
                    Box(
                        modifier = Modifier
                            .align(Alignment.CenterEnd)
                            .size(14.dp)
                            .clip(CircleShape)
                            .background(Color.White)
                            .border(2.dp, Slate800, CircleShape)
                    )
                }
            }
        }
    }
}

@Composable
private fun ScaleSegmentLabel(
    text: String,
    isActive: Boolean,
    activeColor: Color
) {
    Text(
        text = text,
        fontSize = 10.sp,
        fontWeight = FontWeight.Bold,
        color = if (isActive) activeColor else Slate400
    )
}
