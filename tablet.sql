--Oprettelse af AVATAR_URL
ALTER TABLE users
ADD COLUMN avatar_url VARCHAR(255) DEFAULT 'https://r2.fivemanage.com/qMb3oo97IbyX4d9IgBUE5/noavatar.png';
