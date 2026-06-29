package com.nader.gradesapp.viewmodel

import android.app.Application
import androidx.compose.runtime.*
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.nader.gradesapp.data.model.GradeItem
import com.nader.gradesapp.data.repository.DefaultData
import com.nader.gradesapp.data.repository.GradesRepository
import com.nader.gradesapp.data.repository.SettingsStore
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import java.util.UUID

class GradesViewModel(app: Application) : AndroidViewModel(app) {

    private val settings = SettingsStore(app)

    // ─── State ───────────────────────────────────────────────────────────────
    var isTeacherLoggedIn by mutableStateOf(false)
    var isEditMode        by mutableStateOf(false)
    var selectedGrade     by mutableStateOf(1)
    var currentUUID       by mutableStateOf("")
    var uiMessage         by mutableStateOf<String?>(null)
    var isLoading         by mutableStateOf(false)

    // آدرس ورکر — null یعنی هنوز تنظیم نشده
    private val _workerUrl = MutableStateFlow<String?>(null)
    val workerUrl: StateFlow<String?> = _workerUrl

    private val _grades = MutableStateFlow<Map<String, List<GradeItem>>>(DefaultData.grades)
    val grades: StateFlow<Map<String, List<GradeItem>>> = _grades

    // ─── خواندن آدرس ذخیره‌شده هنگام start ──────────────────────────────────
    init {
        viewModelScope.launch {
            settings.workerUrl.collect { url ->
                _workerUrl.value = url
            }
        }
    }

    // ─── ذخیره آدرس ورکر ────────────────────────────────────────────────────
    fun saveWorkerUrl(url: String) {
        viewModelScope.launch {
            settings.saveWorkerUrl(url)
            _workerUrl.value = url
            uiMessage = "آدرس ورکر ذخیره شد ✅"
        }
    }

    // ─── ریست آدرس (از منوی تنظیمات) ───────────────────────────────────────
    fun resetWorkerUrl() {
        viewModelScope.launch {
            settings.clearWorkerUrl()
            _workerUrl.value = null
            isTeacherLoggedIn = false
            isEditMode = false
        }
    }

    // ─── گرفتن Repository با آدرس فعلی ──────────────────────────────────────
    private fun repo(): GradesRepository? {
        val url = _workerUrl.value ?: return null
        return GradesRepository(url)
    }

    // ─── لاگین معلم ─────────────────────────────────────────────────────────
    fun login(password: String): Boolean {
        return if (password == GradesRepository.TEACHER_PASSWORD) {
            isTeacherLoggedIn = true; true
        } else false
    }

    fun logout() { isTeacherLoggedIn = false; isEditMode = false }

    // ─── تولید UUID ─────────────────────────────────────────────────────────
    fun generateUUID() {
        currentUUID = UUID.randomUUID().toString()
        uiMessage = "UUID جدید تولید شد"
    }

    // ─── بارگذاری با UUID ───────────────────────────────────────────────────
    fun loadByUUID(uuid: String) {
        if (uuid.isBlank()) { uiMessage = "UUID را وارد کنید"; return }
        val r = repo() ?: run { uiMessage = "ابتدا آدرس ورکر را تنظیم کنید"; return }
        isLoading = true
        viewModelScope.launch {
            r.loadByUUID(uuid).fold(
                onSuccess = { _grades.value = it; currentUUID = uuid; uiMessage = "توصیف‌ها بارگذاری شدند ✅" },
                onFailure = { uiMessage = "خطا: ${it.message}" }
            )
            isLoading = false
        }
    }

    // ─── ذخیره توصیف‌ها ─────────────────────────────────────────────────────
    fun saveGrades() {
        if (currentUUID.isBlank()) { uiMessage = "ابتدا UUID تولید کنید"; return }
        val r = repo() ?: run { uiMessage = "ابتدا آدرس ورکر را تنظیم کنید"; return }
        isLoading = true
        viewModelScope.launch {
            r.saveGrades(currentUUID, _grades.value).fold(
                onSuccess = { uiMessage = "ذخیره شد ✅" },
                onFailure = { uiMessage = "خطا: ${it.message}" }
            )
            isLoading = false
        }
    }

    // ─── ویرایش توصیف ───────────────────────────────────────────────────────
    fun updateDesc(gradeKey: String, itemId: String, newDesc: String) {
        val current = _grades.value.toMutableMap()
        current[gradeKey] = current[gradeKey]?.map {
            if (it.id == itemId) it.copy(desc = newDesc) else it
        } ?: emptyList()
        _grades.value = current
    }

    fun clearMessage() { uiMessage = null }
    fun currentGradeItems() = _grades.value[selectedGrade.toString()] ?: emptyList()
}
