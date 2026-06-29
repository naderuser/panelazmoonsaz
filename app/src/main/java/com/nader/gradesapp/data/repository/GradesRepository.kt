package com.nader.gradesapp.data.repository

import com.nader.gradesapp.data.model.GradeItem
import com.nader.gradesapp.data.model.SaveRequest
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

class GradesRepository(baseUrl: String) {

    companion object {
        const val TEACHER_PASSWORD = "admin1234"
    }

    private val api: ApiService by lazy {
        val logger = HttpLoggingInterceptor().apply { level = HttpLoggingInterceptor.Level.BODY }
        val client = OkHttpClient.Builder().addInterceptor(logger).build()
        Retrofit.Builder()
            .baseUrl(baseUrl.trimEnd('/') + "/")
            .client(client)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(ApiService::class.java)
    }

    suspend fun loadByUUID(uuid: String): Result<Map<String, List<GradeItem>>> {
        return try {
            val response = api.loadGrades(uuid)
            if (response.isSuccessful && response.body()?.success == true)
                Result.success(response.body()!!.data ?: emptyMap())
            else Result.failure(Exception(response.body()?.error ?: "خطا در بارگذاری"))
        } catch (e: Exception) { Result.failure(e) }
    }

    suspend fun saveGrades(uuid: String, grades: Map<String, List<GradeItem>>): Result<Boolean> {
        return try {
            val response = api.saveGrades(SaveRequest(uuid, grades))
            if (response.isSuccessful && response.body()?.success == true)
                Result.success(true)
            else Result.failure(Exception(response.body()?.error ?: "خطا در ذخیره"))
        } catch (e: Exception) { Result.failure(e) }
    }
}
