package com.nader.gradesapp.data.repository

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "settings")

class SettingsStore(private val context: Context) {

    companion object {
        val WORKER_URL = stringPreferencesKey("worker_url")
    }

    // خواندن آدرس ذخیره‌شده
    val workerUrl: Flow<String?> = context.dataStore.data.map { prefs ->
        prefs[WORKER_URL]
    }

    // ذخیره آدرس
    suspend fun saveWorkerUrl(url: String) {
        context.dataStore.edit { prefs ->
            prefs[WORKER_URL] = url
        }
    }

    // حذف آدرس (ریست)
    suspend fun clearWorkerUrl() {
        context.dataStore.edit { prefs ->
            prefs.remove(WORKER_URL)
        }
    }
}
