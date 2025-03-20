const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const app = express();
const port = 80;

// Sử dụng middleware
app.use(cors());
app.use(express.json());

// Cấu hình kết nối database
const dbConfig = {
  host: 'host.minikube.internal',
  user: 'root', // Thay thế bằng username của bạn
  password: 'Yenmysql153@', // Thay thế bằng password của bạn
  database: 'my_database' // Thay thế bằng tên database của bạn
};

// Tạo pool connection để quản lý kết nối DB hiệu quả
const pool = mysql.createPool(dbConfig);

// Khởi tạo database và tạo bảng user nếu chưa tồn tại
async function initializeDatabase() {
  try {
    // Tạo kết nối trực tiếp không kèm tên database để có thể tạo database
    const tempPool = mysql.createPool({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password
    });
    
    // Tạo database nếu chưa tồn tại
    await tempPool.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    await tempPool.end();
    
    // Kết nối với database đã tạo và tạo bảng user
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL
      )
    `);
    
    // Kiểm tra xem bảng có dữ liệu không
    const [rows] = await pool.query('SELECT * FROM user LIMIT 1');
    
    // Thêm một bản ghi nếu bảng trống
    if (rows.length === 0) {
      await pool.query('INSERT INTO user (name) VALUES (?)', ['Nguyễn Văn A']);
      console.log('Đã thêm dữ liệu mẫu vào bảng user');
    }
    
    console.log('Database và bảng user đã được khởi tạo thành công');
  } catch (error) {
    console.error('Lỗi khởi tạo database:', error);
  }
}

// Khởi tạo database khi server khởi động
initializeDatabase();

// Endpoint chính trả về user đầu tiên (thay thế Hello World)
app.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name FROM user ORDER BY id LIMIT 1');
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy user' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Khởi động server
app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});