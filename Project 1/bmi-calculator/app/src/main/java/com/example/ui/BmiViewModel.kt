package com.example.ui

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.data.AppDatabase
import com.example.data.BmiRecord
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import kotlin.math.roundToInt

enum class UnitSystem {
    METRIC, IMPERIAL
}

enum class Gender {
    MALE, FEMALE, OTHER
}

enum class BmiCategory(val label: String) {
    UNDERWEIGHT("Underweight"),
    NORMAL("Normal Weight"),
    OVERWEIGHT("Overweight"),
    OBESE("Obese")
}

data class BmiUiState(
    val unitSystem: UnitSystem = UnitSystem.METRIC,
    val gender: Gender = Gender.MALE,
    val age: Int = 25,
    // Metric values
    val heightCm: Float = 178f,
    val weightKg: Float = 71.0f,
    // Imperial values
    val heightFeet: Int = 5,
    val heightInches: Int = 10,
    val weightLbs: Float = 156.5f,
    // Target Weight
    val targetWeightKg: Float = 68.0f,
    // Active navigation tab
    val selectedTab: Int = 0 // 0: Dashboard/Calculator, 1: History, 2: Health Tips, 3: Goals/Settings
)

class BmiViewModel(application: Application) : AndroidViewModel(application) {
    private val bmiDao = AppDatabase.getDatabase(application).bmiDao()

    private val _uiState = MutableStateFlow(BmiUiState())
    val uiState: StateFlow<BmiUiState> = _uiState.asStateFlow()

    val historyRecords: StateFlow<List<BmiRecord>> = bmiDao.getAllRecords()
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = emptyList()
        )

    fun setUnitSystem(system: UnitSystem) {
        if (_uiState.value.unitSystem == system) return
        _uiState.update { state ->
            if (system == UnitSystem.IMPERIAL) {
                // Convert metric to imperial
                val totalInches = (state.heightCm / 2.54f).roundToInt()
                val feet = totalInches / 12
                val inches = totalInches % 12
                val lbs = (state.weightKg * 2.20462f * 10).roundToInt() / 10f
                state.copy(
                    unitSystem = system,
                    heightFeet = feet.coerceIn(3, 7),
                    heightInches = inches.coerceIn(0, 11),
                    weightLbs = lbs.coerceAtLeast(50f)
                )
            } else {
                // Convert imperial to metric
                val totalInches = state.heightFeet * 12 + state.heightInches
                val cm = (totalInches * 2.54f).roundToInt().toFloat()
                val kg = (state.weightLbs / 2.20462f * 10).roundToInt() / 10f
                state.copy(
                    unitSystem = system,
                    heightCm = cm.coerceIn(100f, 230f),
                    weightKg = kg.coerceAtLeast(30f)
                )
            }
        }
    }

    fun setGender(gender: Gender) {
        _uiState.update { it.copy(gender = gender) }
    }

    fun setAge(age: Int) {
        _uiState.update { it.copy(age = age.coerceIn(10, 120)) }
    }

    fun setHeightCm(height: Float) {
        _uiState.update { state ->
            val totalInches = (height / 2.54f).roundToInt()
            state.copy(
                heightCm = height.coerceIn(100f, 230f),
                heightFeet = totalInches / 12,
                heightInches = totalInches % 12
            )
        }
    }

    fun setHeightImperial(feet: Int, inches: Int) {
        _uiState.update { state ->
            val safeFeet = feet.coerceIn(3, 7)
            val safeInches = inches.coerceIn(0, 11)
            val totalInches = safeFeet * 12 + safeInches
            val cm = (totalInches * 2.54f).roundToInt().toFloat()
            state.copy(
                heightFeet = safeFeet,
                heightInches = safeInches,
                heightCm = cm
            )
        }
    }

    fun setWeightKg(weight: Float) {
        _uiState.update { state ->
            val lbs = (weight * 2.20462f * 10).roundToInt() / 10f
            state.copy(
                weightKg = (weight * 10).roundToInt() / 10f,
                weightLbs = lbs
            )
        }
    }

    fun setWeightLbs(weight: Float) {
        _uiState.update { state ->
            val kg = (weight / 2.20462f * 10).roundToInt() / 10f
            state.copy(
                weightLbs = (weight * 10).roundToInt() / 10f,
                weightKg = kg
            )
        }
    }

    fun setTargetWeightKg(weight: Float) {
        _uiState.update { it.copy(targetWeightKg = (weight * 10).roundToInt() / 10f) }
    }

    fun setSelectedTab(tab: Int) {
        _uiState.update { it.copy(selectedTab = tab) }
    }

    fun calculateBmi(state: BmiUiState = _uiState.value): Float {
        val heightMeters = state.heightCm / 100f
        if (heightMeters <= 0) return 0f
        val bmi = state.weightKg / (heightMeters * heightMeters)
        return (bmi * 10).roundToInt() / 10f
    }

    fun getBmiCategory(bmi: Float): BmiCategory {
        return when {
            bmi < 18.5f -> BmiCategory.UNDERWEIGHT
            bmi < 25.0f -> BmiCategory.NORMAL
            bmi < 30.0f -> BmiCategory.OVERWEIGHT
            else -> BmiCategory.OBESE
        }
    }

    fun getIdealWeightRangeKg(state: BmiUiState = _uiState.value): Pair<Float, Float> {
        val hM = state.heightCm / 100f
        val minKg = (18.5f * hM * hM * 10).roundToInt() / 10f
        val maxKg = (24.9f * hM * hM * 10).roundToInt() / 10f
        return Pair(minKg, maxKg)
    }

    fun saveCurrentBmiRecord(note: String = "") {
        viewModelScope.launch {
            val currentState = _uiState.value
            val bmi = calculateBmi(currentState)
            val category = getBmiCategory(bmi)
            val record = BmiRecord(
                heightCm = currentState.heightCm,
                weightKg = currentState.weightKg,
                bmiValue = bmi,
                categoryName = category.label,
                note = note
            )
            bmiDao.insertRecord(record)
        }
    }

    fun deleteRecord(record: BmiRecord) {
        viewModelScope.launch {
            bmiDao.deleteRecord(record)
        }
    }

    fun clearAllRecords() {
        viewModelScope.launch {
            bmiDao.clearAll()
        }
    }

    fun formatDate(timestamp: Long): String {
        val sdf = SimpleDateFormat("MMM dd, yyyy • hh:mm a", Locale.getDefault())
        return sdf.format(Date(timestamp))
    }
}
