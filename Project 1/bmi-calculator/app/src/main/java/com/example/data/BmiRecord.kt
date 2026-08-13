package com.example.data

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "bmi_records")
data class BmiRecord(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val heightCm: Float,
    val weightKg: Float,
    val bmiValue: Float,
    val categoryName: String,
    val timestamp: Long = System.currentTimeMillis(),
    val note: String = ""
)
