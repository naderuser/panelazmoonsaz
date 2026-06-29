package com.nader.gradesapp.ui.screens

import androidx.compose.animation.*
import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalClipboardManager
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.nader.gradesapp.data.model.GradeItem
import com.nader.gradesapp.ui.theme.*
import com.nader.gradesapp.viewmodel.GradesViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainScreen(vm: GradesViewModel, onLoginRequest: () -> Unit = {}) {
    val grades by vm.grades.collectAsState()
    val clipboard = LocalClipboardManager.current

    // Toast message
    vm.uiMessage?.let { msg ->
        LaunchedEffect(msg) {
            kotlinx.coroutines.delay(2500)
            vm.clearMessage()
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text("📚 توصیف عملکرد", fontWeight = FontWeight.Bold, fontSize = 18.sp)
                        Text("پایه‌های اول تا ششم | نادر اکشیک", fontSize = 12.sp, color = Color.White.copy(alpha = 0.8f))
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = DarkBg,
                    titleContentColor = Color.White
                ),
                actions = {
                    if (!vm.isTeacherLoggedIn) {
                        IconButton(onClick = { onLoginRequest() }) {
                            Icon(Icons.Default.Lock, "لاگین", tint = Color.White)
                        }
                    } else {
                        IconButton(onClick = { vm.isEditMode = !vm.isEditMode }) {
                            Icon(
                                if (vm.isEditMode) Icons.Default.EditOff else Icons.Default.Edit,
                                "ویرایش",
                                tint = if (vm.isEditMode) OrangeEdit else Color.White
                            )
                        }
                        IconButton(onClick = { vm.saveGrades() }) {
                            Icon(Icons.Default.Save, "ذخیره", tint = Color.White)
                        }
                        IconButton(onClick = { vm.logout() }) {
                            Icon(Icons.Default.ExitToApp, "خروج", tint = Color.White)
                        }
                    }
                }
            )
        },
        snackbarHost = {
            vm.uiMessage?.let { msg ->
                Box(Modifier.fillMaxWidth().padding(16.dp), contentAlignment = Alignment.BottomCenter) {
                    Card(
                        shape = RoundedCornerShape(50.dp),
                        colors = CardDefaults.cardColors(
                            containerColor = if (msg.contains("خطا")) Color(0xFFE53E3E) else GreenOk
                        )
                    ) {
                        Text(msg, modifier = Modifier.padding(horizontal = 24.dp, vertical = 12.dp),
                            color = Color.White, fontWeight = FontWeight.Medium)
                    }
                }
            }
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .background(Color(0xFFF0F2FF))
        ) {
            // ── UUID Panel (معلم) ────────────────────────────────────────────
            if (vm.isTeacherLoggedIn) {
                UUIDPanel(vm)
            }

            // ── Grade Tabs ───────────────────────────────────────────────────
            GradeTabs(
                selected = vm.selectedGrade,
                onSelect = { vm.selectedGrade = it }
            )

            // ── Cards ────────────────────────────────────────────────────────
            val items = vm.currentGradeItems()
            val grouped = items.groupBy { it.subject }

            if (vm.isLoading) {
                Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    CircularProgressIndicator(color = Purple)
                }
            } else {
                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    contentPadding = PaddingValues(16.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    grouped.forEach { (subject, subjectItems) ->
                        item {
                            Text(
                                subject,
                                fontWeight = FontWeight.Bold,
                                fontSize = 18.sp,
                                color = DarkBg,
                                modifier = Modifier.padding(top = 8.dp, bottom = 4.dp)
                            )
                        }
                        items(subjectItems) { item ->
                            GradeCard(
                                item = item,
                                isEditMode = vm.isEditMode && vm.isTeacherLoggedIn,
                                onCopy = {
                                    clipboard.setText(AnnotatedString(item.desc))
                                    vm.uiMessage = "متن کپی شد ✅"
                                },
                                onDescChange = { newDesc ->
                                    vm.updateDesc(vm.selectedGrade.toString(), item.id, newDesc)
                                }
                            )
                        }
                    }
                    item { Spacer(Modifier.height(80.dp)) }
                }
            }
        }
    }
}

// ─── UUID Panel ──────────────────────────────────────────────────────────────
@Composable
fun UUIDPanel(vm: GradesViewModel) {
    var uuidInput by remember { mutableStateOf("") }
    val clipboard = LocalClipboardManager.current

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(12.dp),
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(6.dp)
    ) {
        Column(Modifier.padding(16.dp)) {
            // UUID نمایش
            if (vm.currentUUID.isNotBlank()) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.Key, null, tint = Purple, modifier = Modifier.size(18.dp))
                    Spacer(Modifier.width(6.dp))
                    Text("UUID:", fontWeight = FontWeight.Bold, fontSize = 13.sp, color = TextDark)
                    Spacer(Modifier.width(8.dp))
                    Text(
                        vm.currentUUID,
                        fontSize = 11.sp,
                        color = TextMedium,
                        modifier = Modifier.weight(1f)
                    )
                    IconButton(
                        onClick = {
                            clipboard.setText(AnnotatedString(vm.currentUUID))
                            vm.uiMessage = "UUID کپی شد"
                        },
                        modifier = Modifier.size(32.dp)
                    ) {
                        Icon(Icons.Default.ContentCopy, null, tint = Purple, modifier = Modifier.size(18.dp))
                    }
                }
                Spacer(Modifier.height(8.dp))
            }

            // دکمه‌های UUID
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Button(
                    onClick = { vm.generateUUID() },
                    colors = ButtonDefaults.buttonColors(containerColor = Purple),
                    shape = RoundedCornerShape(50.dp),
                    modifier = Modifier.weight(1f),
                    contentPadding = PaddingValues(horizontal = 8.dp, vertical = 8.dp)
                ) {
                    Icon(Icons.Default.Add, null, modifier = Modifier.size(16.dp))
                    Spacer(Modifier.width(4.dp))
                    Text("UUID جدید", fontSize = 12.sp)
                }
                Button(
                    onClick = { vm.saveGrades() },
                    colors = ButtonDefaults.buttonColors(containerColor = GreenOk),
                    shape = RoundedCornerShape(50.dp),
                    modifier = Modifier.weight(1f),
                    contentPadding = PaddingValues(horizontal = 8.dp, vertical = 8.dp)
                ) {
                    Icon(Icons.Default.Save, null, modifier = Modifier.size(16.dp))
                    Spacer(Modifier.width(4.dp))
                    Text("ذخیره", fontSize = 12.sp)
                }
            }

            Spacer(Modifier.height(10.dp))

            // بارگذاری با UUID
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                OutlinedTextField(
                    value = uuidInput,
                    onValueChange = { uuidInput = it },
                    label = { Text("UUID برای بارگذاری", fontSize = 12.sp) },
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(12.dp),
                    singleLine = true,
                    textStyle = LocalTextStyle.current.copy(fontSize = 12.sp)
                )
                Button(
                    onClick = { vm.loadByUUID(uuidInput) },
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF4299E1)),
                    shape = RoundedCornerShape(12.dp),
                    contentPadding = PaddingValues(12.dp)
                ) {
                    Icon(Icons.Default.Search, null, modifier = Modifier.size(20.dp))
                }
            }
        }
    }
}

// ─── Grade Tabs ──────────────────────────────────────────────────────────────
@Composable
fun GradeTabs(selected: Int, onSelect: (Int) -> Unit) {
    val grades = listOf("اول","دوم","سوم","چهارم","پنجم","ششم")
    ScrollableTabRow(
        selectedTabIndex = selected - 1,
        containerColor = DarkBg,
        contentColor = Color.White,
        edgePadding = 8.dp
    ) {
        grades.forEachIndexed { i, label ->
            Tab(
                selected = selected == i + 1,
                onClick = { onSelect(i + 1) },
                text = {
                    Text(
                        "پایه $label",
                        fontWeight = if (selected == i + 1) FontWeight.Bold else FontWeight.Normal,
                        fontSize = 13.sp
                    )
                }
            )
        }
    }
}

// ─── Grade Card ──────────────────────────────────────────────────────────────
@Composable
fun GradeCard(
    item: GradeItem,
    isEditMode: Boolean,
    onCopy: () -> Unit,
    onDescChange: (String) -> Unit
) {
    var editedDesc by remember(item.id) { mutableStateOf(item.desc) }
    val borderColor = levelColor(item.level)
    val bgColor     = levelBgColor(item.level)

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .border(
                width = 4.dp,
                color = borderColor,
                shape = RoundedCornerShape(topEnd = 20.dp, bottomEnd = 20.dp, topStart = 4.dp, bottomStart = 4.dp)
            ),
        shape = RoundedCornerShape(topEnd = 20.dp, bottomEnd = 20.dp, topStart = 4.dp, bottomStart = 4.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(4.dp)
    ) {
        Column(Modifier.padding(16.dp)) {
            // هدر
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    item.subject,
                    fontWeight = FontWeight.Bold,
                    fontSize = 16.sp,
                    color = TextDark
                )
                Surface(
                    shape = RoundedCornerShape(50.dp),
                    color = bgColor
                ) {
                    Text(
                        item.levelText,
                        modifier = Modifier.padding(horizontal = 12.dp, vertical = 4.dp),
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = borderColor
                    )
                }
            }

            Spacer(Modifier.height(10.dp))

            // متن توصیف
            if (isEditMode) {
                OutlinedTextField(
                    value = editedDesc,
                    onValueChange = {
                        editedDesc = it
                        onDescChange(it)
                    },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = OrangeEdit,
                        unfocusedBorderColor = OrangeEdit.copy(alpha = 0.5f)
                    ),
                    textStyle = LocalTextStyle.current.copy(fontSize = 14.sp, lineHeight = 22.sp)
                )
            } else {
                Text(
                    item.desc,
                    fontSize = 14.sp,
                    lineHeight = 22.sp,
                    color = TextDark,
                    textAlign = TextAlign.Justify
                )
            }

            Spacer(Modifier.height(10.dp))

            // دکمه کپی
            OutlinedButton(
                onClick = onCopy,
                shape = RoundedCornerShape(50.dp),
                colors = ButtonDefaults.outlinedButtonColors(contentColor = Purple),
                border = BorderStroke(1.5.dp, Purple),
                contentPadding = PaddingValues(horizontal = 16.dp, vertical = 6.dp)
            ) {
                Icon(Icons.Default.ContentCopy, null, modifier = Modifier.size(16.dp))
                Spacer(Modifier.width(6.dp))
                Text("کپی توصیف", fontSize = 13.sp)
            }
        }
    }
}

// NOTE: تابع MainScreen باید پارامتر onLoginRequest: () -> Unit را داشته باشد
// این در نسخه کامل پیاده‌سازی شده است
