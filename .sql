CREATE TABLE NguoiDung (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    pass_word VARCHAR(255),
    phone VARCHAR(255),
    birth_day DATE,
    gender VARCHAR(255),
    role VARCHAR(255),
    avatar VARCHAR(255)
);

CREATE TABLE DatPhong (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ma_phong INT,
    ngay_den DATETIME,
    ngay_di DATETIME,
    so_luong_khach INT,
    ma_nguoi_dat INT,
    FOREIGN KEY (ma_phong) REFERENCES Phong(id) ON DELETE CASCADE,
    FOREIGN KEY (ma_nguoi_dat) REFERENCES NguoiDung(id) ON DELETE CASCADE
);

CREATE TABLE Phong (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ten_phong VARCHAR(255),
    khach INT,
    phong_ngu INT,
    giuong INT,
    phong_tam INT,
    mo_ta TEXT,
    gia_tien INT,
    may_giat BOOLEAN,
    ban_la BOOLEAN,
    tivi BOOLEAN,
    dieu_hoa BOOLEAN,
    wifi BOOLEAN,
    bep BOOLEAN,
    do_xe BOOLEAN,
    ho_boi BOOLEAN,
    ban_ui BOOLEAN,
    hinh_anh VARCHAR(255),
    ma_vi_tri INT,
    FOREIGN KEY (ma_vi_tri) REFERENCES ViTri(id) ON DELETE CASCADE
);

CREATE TABLE ViTri (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ten_vi_tri VARCHAR(255),
    tinh_thanh VARCHAR(255),
    quoc_gia INT,
    hinh_anh VARCHAR(255)
);

CREATE TABLE BinhLuan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ma_phong INT,
    ma_nguoi_binh_luan INT,
    ngay_binh_luan DATETIME,
    noi_dung TEXT,
    sao_binh_luan INT,
    FOREIGN KEY (ma_phong) REFERENCES Phong(id) ON DELETE CASCADE,
    FOREIGN KEY (ma_nguoi_binh_luan) REFERENCES NguoiDung(id) ON DELETE CASCADE
);


-- Thêm dữ liệu mẫu vào NguoiDung
INSERT INTO NguoiDung (id, name, email, pass_word, phone, birth_day, gender, role, avatar) VALUES 
(1, 'User1', 'user1@example.com', '$2b$10$c.sIN0we89Ar1R2OfEVsHODUXBQfsDxR2tO7fZdewU.XlGAup97aO', '123456789', '1990-01-01', 'Male', 'User', '/public/imgs/avatars/avatar1.jpg'),
(2, 'User2', 'user2@example.com', '$2b$10$c.sIN0we89Ar1R2OfEVsHODUXBQfsDxR2tO7fZdewU.XlGAup97aO', '123456789', '1990-01-01', 'Female', 'User', '/public/imgs/avatars/avatar2.jpg'),
(3, 'User3', 'user3@example.com', '$2b$10$c.sIN0we89Ar1R2OfEVsHODUXBQfsDxR2tO7fZdewU.XlGAup97aO', '123456789', '1990-01-01', 'Male', 'User', '/public/imgs/avatars/avatar3.jpg'),
(4, 'User4', 'user4@example.com', '$2b$10$c.sIN0we89Ar1R2OfEVsHODUXBQfsDxR2tO7fZdewU.XlGAup97aO', '123456789', '1990-01-01', 'Female', 'User', '/public/imgs/avatars/avatar4.jpg'),
(5, 'User5', 'user5@example.com', '$2b$10$c.sIN0we89Ar1R2OfEVsHODUXBQfsDxR2tO7fZdewU.XlGAup97aO', '123456789', '1990-01-01', 'Male', 'User', '/public/imgs/avatars/avatar5.jpg'),
(6, 'User6', 'user6@example.com', '$2b$10$c.sIN0we89Ar1R2OfEVsHODUXBQfsDxR2tO7fZdewU.XlGAup97aO', '123456789', '1990-01-01', 'Female', 'User', '/public/imgs/avatars/avatar6.jpg'),
(7, 'User7', 'user7@example.com', '$2b$10$c.sIN0we89Ar1R2OfEVsHODUXBQfsDxR2tO7fZdewU.XlGAup97aO', '123456789', '1990-01-01', 'Male', 'User', '/public/imgs/avatars/avatar7.jpg'),
(8, 'User8', 'user8@example.com', '$2b$10$c.sIN0we89Ar1R2OfEVsHODUXBQfsDxR2tO7fZdewU.XlGAup97aO', '123456789', '1990-01-01', 'Female', 'User', '/public/imgs/avatars/avatar8.jpg'),
(9, 'User9', 'user9@example.com', '$2b$10$c.sIN0we89Ar1R2OfEVsHODUXBQfsDxR2tO7fZdewU.XlGAup97aO', '123456789', '1990-01-01', 'Male', 'User', '/public/imgs/avatars/avatar9.jpg'),
(10, 'User10', 'user10@example.com', '$2b$10$c.sIN0we89Ar1R2OfEVsHODUXBQfsDxR2tO7fZdewU.XlGAup97aO', '123456789', '1990-01-01', 'Female', 'User', '/public/imgs/avatars/avatar10.jpg');

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
INSERT INTO Phong (id, ten_phong, khach, phong_ngu, giuong, phong_tam, mo_ta, gia_tien, may_giat, ban_la, tivi, dieu_hoa, wifi, bep, do_xe, ho_boi, ban_ui, hinh_anh, ma_vi_tri) VALUES 
(1, 'Phong1', 2, 1, 1, 1, 'Mo ta phong 1', 1000000, true, true, true, true, true, true, true, true, true, '/public/imgs/rooms/room1.jpg', 1),
(2, 'Phong2', 3, 2, 2, 2, 'Mo ta phong 2', 2000000, true, true, true, true, true, true, true, true, true, '/public/imgs/rooms/room2.jpg', 2),
(3, 'Phong3', 4, 3, 3, 3, 'Mo ta phong 3', 3000000, true, true, true, true, true, true, true, true, true, '/public/imgs/rooms/room3.jpg', 3),
(4, 'Phong4', 2, 1, 1, 1, 'Mo ta phong 4', 1500000, true, true, true, true, true, true, true, true, true, '/public/imgs/rooms/room4.jpg', 4),
(5, 'Phong5', 2, 1, 1, 1, 'Mo ta phong 5', 1000000, true, true, true, true, true, true, true, true, true, '/public/imgs/rooms/room5.jpg', 5),
(6, 'Phong6', 3, 2, 2, 2, 'Mo ta phong 6', 2000000, true, true, true, true, true, true, true, true, true, '/public/imgs/rooms/room6.jpg', 6),
(7, 'Phong7', 4, 3, 3, 3, 'Mo ta phong 7', 3000000, true, true, true, true, true, true, true, true, true, '/public/imgs/rooms/room7.jpg', 7),
(8, 'Phong8', 2, 1, 1, 1, 'Mo ta phong 8', 1500000, true, true, true, true, true, true, true, true, true, '/public/imgs/rooms/room8.jpg', 8),
(9, 'Phong9', 2, 1, 1, 1, 'Mo ta phong 9', 1000000, true, true, true, true, true, true, true, true, true, '/public/imgs/rooms/room9.jpg', 9),
(10, 'Phong10', 3, 2, 2, 2, 'Mo ta phong 10', 2000000, true, true, true, true, true, true, true, true, true, '/public/imgs/rooms/room10.jpg', 10);

-- Thêm dữ liệu mẫu vào ViTri (tiếp tục)
INSERT INTO ViTri (id, ten_vi_tri, tinh_thanh, quoc_gia, hinh_anh) VALUES 
(1, 'ViTri1', 'TinhThanh1', 1, '/public/imgs/locations/location1.jpg'),
(2, 'ViTri2', 'TinhThanh2', 2, '/public/imgs/locations/location2.jpg'),
(3, 'ViTri3', 'TinhThanh3', 3, '/public/imgs/locations/location3.jpg'),
(4, 'ViTri4', 'TinhThanh4', 4, '/public/imgs/locations/location4.jpg'),
(5, 'ViTri5', 'TinhThanh5', 5, '/public/imgs/locations/location5.jpg'),
(6, 'ViTri6', 'TinhThanh6', 6, '/public/imgs/locations/location6.jpg'),
(7, 'ViTri7', 'TinhThanh7', 7, '/public/imgs/locations/location7.jpg'),
(8, 'ViTri8', 'TinhThanh8', 8, '/public/imgs/locations/location8.jpg'),
(9, 'ViTri9', 'TinhThanh9', 9, '/public/imgs/locations/location9.jpg'),
(10, 'ViTri10', 'TinhThanh10', 10, '/public/imgs/locations/location10.jpg');

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
