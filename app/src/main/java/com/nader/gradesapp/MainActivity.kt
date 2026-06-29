package com.nader.gradesapp

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.runtime.*
import androidx.lifecycle.viewmodel.compose.viewModel
import com.nader.gradesapp.ui.screens.LoginScreen
import com.nader.gradesapp.ui.screens.MainScreen
import com.nader.gradesapp.ui.screens.SetupScreen
import com.nader.gradesapp.ui.theme.GradesAppTheme
import com.nader.gradesapp.viewmodel.GradesViewModel

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            GradesAppTheme {
                GradesApp()
            }
        }
    }
}

@Composable
fun GradesApp() {
    val vm: GradesViewModel = viewModel()
    val workerUrl by vm.workerUrl.collectAsState()
    var showLogin by remember { mutableStateOf(false) }

    when {
        // ── اگه آدرس ورکر تنظیم نشده → صفحه Setup ──────────────────────
        workerUrl == null -> {
            SetupScreen(onSave = { url -> vm.saveWorkerUrl(url) })
        }

        // ── اگه باید لاگین نشون بده ──────────────────────────────────────
        showLogin -> {
            LoginScreen(
                onLogin = { password ->
                    if (vm.login(password)) { showLogin = false; true }
                    else false
                },
                onSkip = { showLogin = false }
            )
        }

        // ── صفحه اصلی ────────────────────────────────────────────────────
        else -> {
            MainScreen(
                vm = vm,
                onLoginRequest = { showLogin = true }
            )
        }
    }
}
