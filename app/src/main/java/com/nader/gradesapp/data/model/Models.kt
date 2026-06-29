package com.nader.gradesapp.data.model

import com.google.gson.annotations.SerializedName

// ─── مدل توصیف یک درس ───────────────────────────────────────────────────────
data class GradeItem(
    val id: String,
    val subject: String,          // نام درس
    val level: String,            // level-excellent | level-good | level-acceptable | level-need
    val levelText: String,        // خیلی خوب | خوب | قابل قبول | نیاز به تلاش
    var desc: String              // متن توصیف
)

// ─── پاسخ API بارگذاری ──────────────────────────────────────────────────────
data class LoadResponse(
    val success: Boolean,
    val data: Map<String, List<GradeItem>>? = null,
    val error: String? = null
)

// ─── بدنه درخواست ذخیره ─────────────────────────────────────────────────────
data class SaveRequest(
    val uuid: String,
    val grades: Map<String, List<GradeItem>>
)

// ─── پاسخ API ذخیره ─────────────────────────────────────────────────────────
data class SaveResponse(
    val success: Boolean,
    val error: String? = null
)

// ─── سطح عملکرد ─────────────────────────────────────────────────────────────
enum class PerformanceLevel(val key: String, val label: String, val colorHex: String) {
    EXCELLENT("level-excellent", "خیلی خوب",   "#48bb78"),
    GOOD     ("level-good",      "خوب",         "#ecc94b"),
    ACCEPTABLE("level-acceptable","قابل قبول",  "#fc8181"),
    NEED     ("level-need",      "نیاز به تلاش","#a0aec0");

    companion object {
        fun fromKey(key: String) = values().find { it.key == key } ?: GOOD
    }
}
