### **Penjelasan Konsep: "Casting App Portal"**

Konsep utama web ini adalah **Katalog Dinamis & Pusat Monitoring**. Alih-alih pengguna harus mengingat banyak tautan URL untuk berbagai keperluan (misalnya satu *link* untuk mencatat temperatur, satu lagi untuk *Trial Flow Monitor*, dll), mereka hanya perlu mengakses satu pintu utama.

* **Sisi Pengguna (Frontend):** Berfungsi layaknya etalase. Saat diakses, pengguna disajikan animasi *hero section* yang futuristik namun ringan, memberikan kesan industrial yang modern. Di bawahnya, terdapat metrik (KPI) yang menunjukkan berapa banyak aplikasi yang *online* atau dalam masa *maintenance*. Setiap aplikasi (seperti *Smart Pouring Log System*, *IdeaVault*, dll) memiliki kartunya sendiri (*App Card*) lengkap dengan logo, deskripsi, status, dan tombol akses. Pengguna juga bisa memberikan *rating* bintang dan melaporkan masalah (*bug*) langsung dari sana.
* **Sisi Developer/Admin (Backend/Dashboard):** Berfungsi sebagai ruang mesin. Anda tidak perlu mengubah kode setiap kali ada penambahan aplikasi baru. Melalui *dashboard* admin, Anda bisa menambah proyek baru, membaca keluhan/saran dari operator di lapangan, dan yang paling penting: memiliki saklar (Toggle) untuk mengubah status aplikasi menjadi "Active" atau "Under Maintenance". Jika diubah ke "Maintenance", tombol akses di sisi pengguna akan otomatis terkunci atau menampilkan pesan perbaikan.

---

### **Product Requirements Document (PRD)**

#### **1. Informasi Umum**

* **Nama Proyek:** Casting App Portal (Bisa disesuaikan)
* **Platform:** Web Application (Responsive/Mobile-Friendly)
* **Tech Stack Prioritas:** Next.js & React (Frontend), Tailwind CSS (Styling), Node.js (Backend), PostgreSQL (Database).

#### **2. Tujuan Produk**

Membuat portal pendaratan (*landing page*) terpusat untuk mempermudah akses, monitoring kelancaran operasi, dan pengumpulan masukan (*feedback*) terhadap seluruh aplikasi internal yang digunakan di area produksi *melting* dan *pouring* PT Toyota Manufacturing Indonesia.

#### **3. Peran Pengguna (User Roles)**

1. **User (Operator / Leader Line):** Mengakses portal untuk membuka aplikasi spesifik, melihat status ketersediaan (*uptime*), memberikan *rating*, dan mengirimkan saran/laporan *bug*.
2. **Admin / Developer (Anda):** Memiliki akses masuk (*login*) khusus untuk mengelola aplikasi, merubah status sistem, dan membaca laporan dari pengguna.

#### **4. Fitur Utama (Key Features)**

**A. Mode Publik / User (Landing Page)**

* **Hero Section:** Bagian atas halaman dengan judul portal, deskripsi singkat, dan animasi yang relevan dengan proses *casting/manufacturing* (bisa menggunakan *Lottie animations* atau animasi CSS sederhana).
* **KPI Cards:** Rangkuman metrik sistem.
* Total Aplikasi Tersedia.
* Aplikasi Aktif (Warna Hijau).
* Aplikasi dalam *Maintenance* (Warna Kuning/Merah).
* Total Laporan/Saran bulan ini.


* **App Directory Grid:** Daftar aplikasi dalam bentuk kartu (*Card*). Masing-masing kartu memuat:
* Logo/Ikon Aplikasi.
* Nama Proyek (Contoh: *Smart Pouring Log System*, *Trial Flow Monitor*).
* Deskripsi singkat fungsi alat.
* *Badge* Status: "Active" atau "Maintenance".
* Rata-rata *Rating* Bintang.
* Tombol "Buka Aplikasi" (Otomatis dinonaktifkan jika status *maintenance*).


* **Review & Feedback Modal:** Saat pengguna mengklik tombol "Beri Masukan" pada sebuah aplikasi, akan muncul *pop-up* form yang berisi:
* Pilihan Bintang (1 - 5).
* Kolom Pesan (Saran / Laporan *Bug*).
* Tombol Kirim.


* **Footer:** Informasi *copyright*, versi portal, dan kontak internal *developer*.

**B. Mode Developer / Admin (Dashboard)**

* **Admin Authentication:** Halaman *login* aman khusus untuk *developer*.
* **App Management (CRUD):** * **Add App:** Form untuk menginput nama aplikasi baru, *upload* logo, deskripsi, dan URL tujuan.
* **Edit/Delete App:** Memodifikasi detail aplikasi jika ada perubahan struktur.
* **Status Controller:** *Toggle switch* untuk mengubah status aplikasi secara instan (*Active* $\leftrightarrow$ *Maintenance*).


* **Feedback Inbox:** Tabel khusus untuk membaca semua *rating* dan saran yang masuk.
* Filter berdasarkan nama aplikasi.
* Filter berdasarkan tipe (Rating rendah vs Rating tinggi).
* Fitur "Mark as Read" atau "Resolved" untuk laporan *bug* yang sudah diperbaiki.



#### **5. Struktur Basis Data Skematik (PostgreSQL)**

Diperlukan setidaknya tiga tabel utama dalam skema *database*:

1. **Table `applications**`
* `id` (Primary Key)
* `name` (String)
* `description` (Text)
* `logo_url` (String)
* `access_link` (String)
* `status` (Enum: 'ACTIVE', 'MAINTENANCE')
* `created_at` (Timestamp)


2. **Table `feedbacks**`
* `id` (Primary Key)
* `app_id` (Foreign Key -> applications.id)
* `rating` (Integer: 1-5)
* `message` (Text)
* `is_resolved` (Boolean)
* `created_at` (Timestamp)


3. **Table `users` (Hanya untuk Admin)**
* `id` (Primary Key)
* `username` (String)
* `password_hash` (String)



#### **6. Alur Kerja (User Flow)**

* **Skenario Harian Operator:** Operator membutuhkan *tools* pencatatan. Mereka membuka URL Portal $\rightarrow$ Melihat status aplikasi semuanya "Active" $\rightarrow$ Mencari *card* aplikasi yang dituju $\rightarrow$ Klik "Buka Aplikasi" $\rightarrow$ Diarahkan ke *tab* baru berisi web aplikasi tersebut.
* **Skenario Pelaporan Masalah:** Saat proses pengecoran berjalan, operator menemukan *bug* pada web aplikasi $\rightarrow$ Operator kembali ke Portal $\rightarrow$ Klik ikon *feedback* di aplikasi yang bermasalah $\rightarrow$ Mengisi 3 bintang dan menulis "Tombol input lot number tidak responsif" $\rightarrow$ Klik kirim.
* **Skenario Tindakan Developer:** Anda *login* ke Admin Mode $\rightarrow$ Melihat ada *feedback* masuk $\rightarrow$ Anda menggeser status aplikasi tersebut menjadi "Maintenance" agar operator lain tidak menggunakannya sementara waktu $\rightarrow$ Memperbaiki *bug* $\rightarrow$ Mengembalikan status menjadi "Active" $\rightarrow$ Menandai *feedback* sebagai *Resolved*.

