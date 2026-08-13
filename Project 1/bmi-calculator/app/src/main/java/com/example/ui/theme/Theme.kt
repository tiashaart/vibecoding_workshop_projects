package com.example.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val FrostedColorScheme = lightColorScheme(
    primary = PrimaryIndigo,
    onPrimary = Color.White,
    primaryContainer = Color(0xFFEEF2FF),
    onPrimaryContainer = PrimaryIndigo,
    secondary = SecondaryBlue,
    onSecondary = Color.White,
    background = GlassCanvasBg,
    onBackground = Slate900,
    surface = GlassSurface,
    onSurface = Slate800,
    surfaceVariant = GlassSurfaceHighlight,
    onSurfaceVariant = Slate500,
    outline = GlassBorder
)

private val DarkFrostedColorScheme = darkColorScheme(
    primary = PrimaryIndigo,
    onPrimary = Color.White,
    background = Color(0xFF0F172A),
    onBackground = Color(0xFFF8FAFC),
    surface = Color(0x33FFFFFF),
    onSurface = Color(0xFFF1F5F9),
    surfaceVariant = Color(0x4DFFFFFF),
    onSurfaceVariant = Color(0xFF94A3B8),
    outline = Color(0x33FFFFFF)
)

@Composable
fun MyApplicationTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    dynamicColor: Boolean = false,
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkFrostedColorScheme else FrostedColorScheme

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}

