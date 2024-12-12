CREATE TABLE NguoiDung (
    id INT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE, -- Đảm bảo tính duy nhất của email
    pass_word VARCHAR(255),
    phone VARCHAR(255),
    birth_day DATE,
    gender VARCHAR(255),
    role VARCHAR(255)
);

CREATE TABLE DatPhong (
    id INT PRIMARY KEY,
    ma_phong INT,
    ngay_den DATETIME,
    ngay_di DATETIME,
    so_luong_khach INT,
    ma_nguoi_dat INT,
    FOREIGN KEY (ma_phong) REFERENCES Phong(id),
    FOREIGN KEY (ma_nguoi_dat) REFERENCES NguoiDung(id)
);

CREATE TABLE Phong (
    id INT PRIMARY KEY,
    ten_phong VARCHAR(255),
    khach INT,
    phong_ngu INT,
    giuong INT,
    phong_tam INT,
    mo_ta TEXT, -- Sử dụng TEXT cho trường mô tả dài
    gia_tien INT,
    may_giat BOOLEAN,
    ban_la BOOLEAN,
    tivi BOOLEAN,
    dieu_hoa BOOLEAN,
    wifi BOOLEAN,
    bep BOOLEAN,
    do_xe BOOLEAN,
    ho_boi BOOLEAN,
    ban_ui BOOLEAN
);

CREATE TABLE ViTri (
    id INT PRIMARY KEY,
    ten_vi_tri VARCHAR(255),
    tinh_thanh VARCHAR(255),
    quoc_gia INT -- Kiểm tra lại kiểu dữ liệu cho quốc gia
);

CREATE TABLE BinhLuan (
    id INT PRIMARY KEY,
    ma_phong INT, -- Thay đổi thành ma_phong
    ma_nguoi_binh_luan INT,
    ngay_binh_luan DATETIME,
    noi_dung TEXT,
    sao_binh_luan INT,
    FOREIGN KEY (ma_phong) REFERENCES Phong(id),
    FOREIGN KEY (ma_nguoi_binh_luan) REFERENCES NguoiDung(id)
);

CREATE TABLE Avatar (
    id INT PRIMARY KEY,
    user_id INT,
    avatar_path VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES NguoiDung(id)
);

CREATE TABLE HinhPhong (
    id INT PRIMARY KEY,
    phong_id INT,
    image_path VARCHAR(255),
    FOREIGN KEY (phong_id) REFERENCES Phong(id)
);

CREATE TABLE HinhViTri (
    id INT PRIMARY KEY,
    vi_tri_id INT,
    image_path VARCHAR(255),
    FOREIGN KEY (vi_tri_id) REFERENCES ViTri(id)
);

-- Thêm dữ liệu mẫu vào NguoiDung
INSERT INTO NguoiDung (id, name, email, pass_word, phone, birth_day, gender, role) VALUES 
(1, 'User1', 'user1@example.com', 'password1', '123456789', '1990-01-01', 'Male', 'User'),
(2, 'User2', 'user2@example.com', 'password2', '123456789', '1990-01-01', 'Female', 'User'),
(3, 'User3', 'user3@example.com', 'password3', '123456789', '1990-01-01', 'Male', 'User'),
(4, 'User4', 'user4@example.com', 'password4', '123456789', '1990-01-01', 'Female', 'User'),
(5, 'User5', 'user5@example.com', 'password5', '123456789', '1990-01-01', 'Male', 'User'),
(6, 'User6', 'user6@example.com', 'password6', '123456789', '1990-01-01', 'Female', 'User'),
(7, 'User7', 'user7@example.com', 'password7', '123456789', '1990-01-01', 'Male', 'User'),
(8, 'User8', 'user8@example.com', 'password8', '123456789', '1990-01-01', 'Female', 'User'),
(9, 'User9', 'user9@example.com', 'password9', '123456789', '1990-01-01', 'Male', 'User'),
(10, 'User10', 'user10@example.com', 'password10', '123456789', '1990-01-01', 'Female', 'User');

-- Thêm dữ liệu mẫu vào DatPhong
INSERT INTO DatPhong (id, ma_phong, ngay_den, ngay_di, so_luong_khach, ma_nguoi_dat) VALUES 
(1, 1, '2024-12-01 14:00:00', '2024-12-05 11:00:00', 2, 1),
(2, 2, '2024-12-02 14:00:00', '2024-12-06 11:00:00', 2, 2),
(3, 3, '2024-12-03 14:00:00', '2024-12-07 11:00:00', 3, 3),
(4, 4, '2024-12-04 14:00:00', '2024-12-08 11:00:00', 1, 4),
(5, 5, '2024-12-05 14:00:00', '2024-12-09 11:00:00', 4, 5),
(6, 6, '2024-12-06 14:00:00', '2024-12-10 11:00:00', 2, 6),
(7, 7, '2024-12-07 14:00:00', '2024-12-11 11:00:00', 3, 7),
(8, 8, '2024-12-08 14:00:00', '2024-12-12 11:00:00', 2, 8),
(9, 9, '2024-12-09 14:00:00', '2024-12-13 11:00:00', 2, 9),
(10, 10, '2024-12-10 14:00:00', '2024-12-14 11:00:00', 1, 10);

-- Thêm dữ liệu mẫu vào Phong
INSERT INTO Phong (id, ten_phong, khach, phong_ngu, giuong, phong_tam, mo_ta, gia_tien, may_giat, ban_la, tivi, dieu_hoa, wifi, bep, do_xe, ho_boi, ban_ui) VALUES 
(1, 'Phong1', 2, 1, 1, 1, 'Mo ta phong 1', 1000000, true, true, true, true, true, true, true, true, true),
(2, 'Phong2', 3, 2, 2, 2, 'Mo ta phong 2', 2000000, true, true, true, true, true, true, true, true, true),
(3, 'Phong3', 4, 3, 3, 3, 'Mo ta phong 3', 3000000, true, true, true, true, true, true, true, true, true),
(4, 'Phong4', 2, 1, 1, 1, 'Mo ta phong 4', 1500000, true, true, true, true, true, true, true, true, true),
(5, 'Phong5', 2, 1, 1, 1, 'Mo ta phong 5', 1000000, true, true, true, true, true, true, true, true, true),
(6, 'Phong6', 3, 2, 2, 2, 'Mo ta phong 6', 2000000, true, true, true, true, true, true, true, true, true),
(7, 'Phong7', 4, 3, 3, 3, 'Mo ta phong 7', 3000000, true, true, true, true, true, true, true, true, true),
(8, 'Phong8', 2, 1, 1, 1, 'Mo ta phong 8', 1500000, true, true, true, true, true, true, true, true, true),
(9, 'Phong9', 2, 1, 1, 1, 'Mo ta phong 9', 1000000, true, true, true, true, true, true, true, true, true),
(10, 'Phong10', 3, 2, 2, 2, 'Mo ta phong 10', 2000000, true, true, true, true, true, true, true, true, true);

-- Thêm dữ liệu mẫu vào ViTri (tiếp tục)
INSERT INTO ViTri (id, ten_vi_tri, tinh_thanh, quoc_gia) VALUES 
(1, 'ViTri1', 'TinhThanh1', 1),
(2, 'ViTri2', 'TinhThanh2', 2),
(3, 'ViTri3', 'TinhThanh3', 3),
(4, 'ViTri4', 'TinhThanh4', 4),
(5, 'ViTri5', 'TinhThanh5', 5),
(6, 'ViTri6', 'TinhThanh6', 6),
(7, 'ViTri7', 'TinhThanh7', 7),
(8, 'ViTri8', 'TinhThanh8', 8),
(9, 'ViTri9', 'TinhThanh9', 9),
(10, 'ViTri10', 'TinhThanh10', 10);

-- Thêm dữ liệu mẫu vào BinhLuan
INSERT INTO BinhLuan (id, ma_phong, ma_nguoi_binh_luan, ngay_binh_luan, noi_dung, sao_binh_luan) VALUES 
(1, 1, 1, '2024-12-01 12:00:00', 'Binh luan 1', 5),
(2, 2, 2, '2024-12-02 12:00:00', 'Binh luan 2', 4),
(3, 3, 3, '2024-12-03 12:00:00', 'Binh luan 3', 3),
(4, 4, 4, '2024-12-04 12:00:00', 'Binh luan 4', 5),
(5, 5, 5, '2024-12-05 12:00:00', 'Binh luan 5', 4),
(6, 6, 6, '2024-12-06 12:00:00', 'Binh luan 6', 3),
(7, 7, 7, '2024-12-07 12:00:00', 'Binh luan 7', 5),
(8, 8, 8, '2024-12-08 12:00:00', 'Binh luan 8', 4),
(9, 9, 9, '2024-12-09 12:00:00', 'Binh luan 9', 3),
(10, 10, 10, '2024-12-10 12:00:00', 'Binh luan 10', 5);

-- Thêm dữ liệu mẫu vào Avatar
INSERT INTO Avatar (id, user_id, avatar_path) VALUES 
(1, 1, '/imgs/avatars/avatar1.jpg'),
(2, 2, '/imgs/avatars/avatar2.jpg'),
(3, 3, '/imgs/avatars/avatar3.jpg'),
(4, 4, '/imgs/avatars/avatar4.jpg'),
(5, 5, '/imgs/avatars/avatar5.jpg'),
(6, 6, '/imgs/avatars/avatar6.jpg'),
(7, 7, '/imgs/avatars/avatar7.jpg'),
(8, 8, '/imgs/avatars/avatar8.jpg'),
(9, 9, '/imgs/avatars/avatar9.jpg'),
(10, 10, '/imgs/avatars/avatar10.jpg');

-- Thêm dữ liệu mẫu vào HinhPhong
INSERT INTO HinhPhong (id, phong_id, image_path) VALUES 
(1, 1, '/imgs/rooms/room1_1.jpg'),
(2, 1, '/imgs/rooms/room1_2.jpg'),
(3, 1, '/imgs/rooms/room1_3.jpg'),
(4, 2, '/imgs/rooms/room2_1.jpg'),
(5, 2, '/imgs/rooms/room2_2.jpg'),
(6, 2, '/imgs/rooms/room2_3.jpg'),
(7, 3, '/imgs/rooms/room3_1.jpg'),
(8, 3, '/imgs/rooms/room3_2.jpg'),
(9, 3, '/imgs/rooms/room3_3.jpg'),
(10, 4, '/imgs/rooms/room4_1.jpg'),
(11, 4, '/imgs/rooms/room4_2.jpg'),
(12, 4, '/imgs/rooms/room4_3.jpg'),
(13, 5, '/imgs/rooms/room5_1.jpg'),
(14, 5, '/imgs/rooms/room5_2.jpg'),
(15, 5, '/imgs/rooms/room5_3.jpg'),
(16, 6, '/imgs/rooms/room6_1.jpg'),
(17, 6, '/imgs/rooms/room6_2.jpg'),
(18, 6, '/imgs/rooms/room6_3.jpg'),
(19, 7, '/imgs/rooms/room7_1.jpg'),
(20, 7, '/imgs/rooms/room7_2.jpg'),
(21, 7, '/imgs/rooms/room7_3.jpg'),
(22, 8, '/imgs/rooms/room8_1.jpg'),
(23, 8, '/imgs/rooms/room8_2.jpg'),
(24, 8, '/imgs/rooms/room8_3.jpg'),
(25, 9, '/imgs/rooms/room9_1.jpg'),
(26, 9, '/imgs/rooms/room9_2.jpg'),
(27, 9, '/imgs/rooms/room9_3.jpg'),
(28, 10, '/imgs/rooms/room10_1.jpg'),
(29, 10, '/imgs/rooms/room10_2.jpg'),
(30, 10, '/imgs/rooms/room10_3.jpg');

-- Thêm dữ liệu mẫu vào HinhViTri
INSERT INTO HinhViTri (id, vi_tri_id, image_path) VALUES 
(1, 1, '/imgs/locations/location1.jpg'),
(2, 2, '/imgs/locations/location2.jpg'),
(3, 3, '/imgs/locations/location3.jpg'),
(4, 4, '/imgs/locations/location4.jpg'),
(5, 5, '/imgs/locations/location5.jpg'),
(6, 6, '/imgs/locations/location6.jpg'),
(7, 7, '/imgs/locations/location7.jpg'),
(8, 8, '/imgs/locations/location8.jpg'),
(9, 9, '/imgs/locations/location9.jpg'),
(10, 10, '/imgs/locations/location10.jpg');

