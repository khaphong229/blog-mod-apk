import { PrismaClient, Role, PostStatus, CommentStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // ============================================
  // 1. CREATE USERS
  // ============================================
  console.log("👥 Creating users...");

  const hashedPassword = await bcrypt.hash("Admin@123", 10);

  const superAdmin = await prisma.user.upsert({
    where: { email: "admin@blogmodapk.com" },
    update: {},
    create: {
      email: "admin@blogmodapk.com",
      name: "Super Admin",
      password: hashedPassword,
      role: Role.SUPER_ADMIN,
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
    },
  });

  const editor1 = await prisma.user.upsert({
    where: { email: "editor1@blogmodapk.com" },
    update: {},
    create: {
      email: "editor1@blogmodapk.com",
      name: "Nguyễn Văn A",
      password: hashedPassword,
      role: Role.EDITOR,
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=editor1",
    },
  });

  const editor2 = await prisma.user.upsert({
    where: { email: "editor2@blogmodapk.com" },
    update: {},
    create: {
      email: "editor2@blogmodapk.com",
      name: "Trần Thị B",
      password: hashedPassword,
      role: Role.EDITOR,
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=editor2",
    },
  });

  const users = [];
  for (let i = 1; i <= 5; i++) {
    const user = await prisma.user.upsert({
      where: { email: `user${i}@blogmodapk.com` },
      update: {},
      create: {
        email: `user${i}@blogmodapk.com`,
        name: `User ${i}`,
        password: hashedPassword,
        role: Role.USER,
        image: `https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`,
      },
    });
    users.push(user);
  }

  console.log(`✅ Created ${users.length + 3} users`);

  // ============================================
  // 2. CREATE CATEGORIES
  // ============================================
  console.log("📁 Creating categories...");

  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "ung-dung" },
      update: {},
      create: {
        name: "Ứng dụng",
        slug: "ung-dung",
        description: "Các ứng dụng hữu ích cho Android và iOS",
        icon: "Smartphone",
        color: "#3B82F6",
        order: 1,
      },
    }),
    prisma.category.upsert({
      where: { slug: "game" },
      update: {},
      create: {
        name: "Game",
        slug: "game",
        description: "Game mobile hấp dẫn, đồ họa đẹp",
        icon: "Gamepad2",
        color: "#EF4444",
        order: 2,
      },
    }),
    prisma.category.upsert({
      where: { slug: "cong-cu" },
      update: {},
      create: {
        name: "Công cụ",
        slug: "cong-cu",
        description: "Công cụ tiện ích, toolbox hỗ trợ",
        icon: "Wrench",
        color: "#10B981",
        order: 3,
      },
    }),
    prisma.category.upsert({
      where: { slug: "tin-tuc" },
      update: {},
      create: {
        name: "Tin tức",
        slug: "tin-tuc",
        description: "Tin tức công nghệ mới nhất",
        icon: "Newspaper",
        color: "#F59E0B",
        order: 4,
      },
    }),
    prisma.category.upsert({
      where: { slug: "huong-dan" },
      update: {},
      create: {
        name: "Hướng dẫn",
        slug: "huong-dan",
        description: "Hướng dẫn sử dụng ứng dụng, game",
        icon: "BookOpen",
        color: "#8B5CF6",
        order: 5,
      },
    }),
    prisma.category.upsert({
      where: { slug: "review" },
      update: {},
      create: {
        name: "Review",
        slug: "review",
        description: "Đánh giá chi tiết ứng dụng, game",
        icon: "Star",
        color: "#EC4899",
        order: 6,
      },
    }),
    prisma.category.upsert({
      where: { slug: "cap-nhat" },
      update: {},
      create: {
        name: "Cập nhật",
        slug: "cap-nhat",
        description: "Thông tin cập nhật phiên bản mới",
        icon: "RefreshCw",
        color: "#06B6D4",
        order: 7,
      },
    }),
  ]);

  console.log(`✅ Created ${categories.length} categories`);

  // ============================================
  // 3. CREATE TAGS
  // ============================================
  console.log("🏷️  Creating tags...");

  const tagNames = [
    "MOD",
    "Premium",
    "Free",
    "No Ads",
    "Unlocked",
    "Offline",
    "Multiplayer",
    "Action",
    "Strategy",
    "Puzzle",
    "Social",
    "Photography",
    "Video Editor",
    "Music",
    "VPN",
    "Security",
    "Productivity",
    "Education",
    "Entertainment",
    "Hot",
  ];

  const tags = await Promise.all(
    tagNames.map((name) =>
      prisma.tag.upsert({
        where: { slug: name.toLowerCase().replace(/\s+/g, "-") },
        update: {},
        create: {
          name,
          slug: name.toLowerCase().replace(/\s+/g, "-"),
          description: `Tag ${name}`,
        },
      })
    )
  );

  console.log(`✅ Created ${tags.length} tags`);

  // ============================================
  // 4. CREATE POSTS
  // ============================================
  console.log("📝 Creating posts...");

  const postsData = [
    // Apps
    {
      title: "WhatsApp Plus MOD APK - Tính năng Premium miễn phí",
      slug: "whatsapp-plus-mod-apk",
      excerpt:
        "Tải WhatsApp Plus MOD APK với nhiều tính năng độc quyền như ẩn tick xanh, tùy chỉnh giao diện, gửi file lớn và nhiều hơn nữa.",
      content: `
<h2>Giới thiệu WhatsApp Plus</h2>
<p>WhatsApp Plus là phiên bản MOD của WhatsApp chính thức với nhiều tính năng nâng cao. Bạn có thể tùy chỉnh giao diện, ẩn trạng thái online, gửi file có kích thước lớn hơn và nhiều tính năng khác mà WhatsApp gốc không có.</p>

<h3>Tính năng nổi bật:</h3>
<ul>
  <li>🎨 Tùy chỉnh giao diện với hàng nghìn theme</li>
  <li>👻 Ẩn tick xanh, tick đôi, trạng thái online</li>
  <li>📁 Gửi file lên đến 1GB</li>
  <li>📸 Gửi ảnh chất lượng cao không bị nén</li>
  <li>🔒 Khóa ứng dụng bằng mật khẩu hoặc vân tay</li>
  <li>💬 Gửi tin nhắn cho người chưa lưu số</li>
  <li>📊 Xem story đã xóa</li>
</ul>

<h3>Hướng dẫn cài đặt:</h3>
<ol>
  <li>Gỡ cài đặt WhatsApp chính thức (nhớ sao lưu dữ liệu)</li>
  <li>Tải file APK từ link bên dưới</li>
  <li>Bật "Cài đặt từ nguồn không xác định"</li>
  <li>Cài đặt và đăng nhập tài khoản</li>
  <li>Khôi phục dữ liệu từ bản sao lưu</li>
</ol>

<h3>Lưu ý:</h3>
<p>⚠️ WhatsApp Plus không phải là ứng dụng chính thức từ Meta. Sử dụng các phiên bản MOD có thể vi phạm điều khoản dịch vụ của WhatsApp. Bạn nên cân nhắc trước khi sử dụng.</p>
      `,
      categoryId: categories[0].id,
      authorId: editor1.id,
      status: PostStatus.PUBLISHED,
      featured: true,
      version: "17.80",
      fileSize: "58 MB",
      requirements: "Android 5.0 trở lên",
      developer: "WhatsApp Plus Team",
      downloadUrl: "https://example.com/whatsapp-plus.apk",
      downloadCount: 15420,
      viewCount: 28500,
      publishedAt: new Date("2025-01-10"),
      tags: { connect: [{ id: tags[0].id }, { id: tags[1].id }, { id: tags[3].id }] },
    },
    {
      title: "Telegram Premium MOD - Mở khóa tất cả tính năng cao cấp",
      slug: "telegram-premium-mod",
      excerpt:
        "Sử dụng Telegram Premium hoàn toàn miễn phí với MOD APK. Tốc độ tải nhanh hơn, sticker độc quyền, emoji phản ứng không giới hạn.",
      content: `
<h2>Telegram Premium MOD là gì?</h2>
<p>Telegram Premium MOD cho phép bạn trải nghiệm tất cả tính năng cao cấp của Telegram mà không cần trả phí hàng tháng.</p>

<h3>Tính năng Premium được mở khóa:</h3>
<ul>
  <li>⚡ Tốc độ tải file nhanh gấp đôi</li>
  <li>📦 Upload file lên đến 4GB</li>
  <li>😊 200+ sticker và emoji phản ứng độc quyền</li>
  <li>🎭 Avatar động (animated profile)</li>
  <li>💬 Chat folder không giới hạn</li>
  <li>🔊 Chuyển giọng nói thành văn bản</li>
  <li>🎨 Theme và màu sắc tùy chỉnh cao cấp</li>
</ul>
      `,
      categoryId: categories[0].id,
      authorId: editor2.id,
      status: PostStatus.PUBLISHED,
      featured: true,
      version: "10.5.2",
      fileSize: "82 MB",
      requirements: "Android 6.0+",
      developer: "Telegram FZ LLC",
      downloadUrl: "https://example.com/telegram-premium.apk",
      downloadCount: 22100,
      viewCount: 35800,
      publishedAt: new Date("2025-01-12"),
      tags: { connect: [{ id: tags[0].id }, { id: tags[1].id }, { id: tags[19].id }] },
    },
    {
      title: "Spotify Premium APK - Nghe nhạc không giới hạn, không quảng cáo",
      slug: "spotify-premium-apk",
      excerpt:
        "Tận hưởng Spotify Premium với chất lượng âm thanh cao nhất, tải nhạc offline, bỏ qua bài không giới hạn và không có quảng cáo.",
      content: `
<h2>Spotify Premium MOD APK</h2>
<p>Phiên bản MOD của Spotify cho phép bạn trải nghiệm tất cả tính năng Premium hoàn toàn miễn phí.</p>

<h3>Tính năng Premium:</h3>
<ul>
  <li>🎵 Chất lượng âm thanh Very High (320kbps)</li>
  <li>📥 Tải nhạc nghe offline không giới hạn</li>
  <li>⏭️ Skip bài không giới hạn</li>
  <li>🚫 Không có quảng cáo</li>
  <li>🔀 Chế độ Shuffle tắt/bật tự do</li>
  <li>📱 Nghe nhạc nền khi tắt màn hình</li>
</ul>

<h3>Yêu cầu hệ thống:</h3>
<p>Android 5.0 trở lên, khoảng 100MB dung lượng trống.</p>
      `,
      categoryId: categories[0].id,
      authorId: editor1.id,
      status: PostStatus.PUBLISHED,
      featured: false,
      version: "8.9.50",
      fileSize: "95 MB",
      requirements: "Android 5.0+",
      developer: "Spotify AB",
      downloadUrl: "https://example.com/spotify-premium.apk",
      downloadCount: 45200,
      viewCount: 78900,
      publishedAt: new Date("2025-01-08"),
      tags: { connect: [{ id: tags[0].id }, { id: tags[1].id }, { id: tags[13].id }] },
    },
    // Games
    {
      title: "PUBG Mobile VN MOD Menu - Aimbot, Wallhack, ESP",
      slug: "pubg-mobile-vn-mod-menu",
      excerpt:
        "PUBG Mobile VN phiên bản MOD với MOD Menu tích hợp nhiều tính năng hỗ trợ như aimbot, wallhack, ESP, tăng tốc độ chạy.",
      content: `
<h2>PUBG Mobile VN MOD Menu</h2>
<p>⚠️ <strong>CẢNH BÁO:</strong> Sử dụng MOD trong game online có thể khiến tài khoản bị khóa vĩnh viễn. Sử dụng với trách nhiệm của bản thân!</p>

<h3>Tính năng MOD Menu:</h3>
<ul>
  <li>🎯 Aimbot - Tự động ngắm bắn</li>
  <li>👁️ Wallhack - Nhìn xuyên tường</li>
  <li>📍 ESP - Hiển thị vị trí kẻ địch</li>
  <li>🏃 Speed Hack - Tăng tốc độ di chuyển</li>
  <li>🛡️ No Recoil - Không giật súng</li>
  <li>🎒 Item ESP - Hiển thị vật phẩm</li>
</ul>

<h3>Hướng dẫn sử dụng:</h3>
<ol>
  <li>Gỡ PUBG Mobile gốc</li>
  <li>Cài đặt file APK MOD</li>
  <li>Mở game, trong trận đấu nhấn vào icon floating</li>
  <li>Bật/tắt các tính năng theo ý muốn</li>
</ol>

<p><strong>Khuyến cáo:</strong> Nên sử dụng tài khoản phụ để tránh mất tài khoản chính.</p>
      `,
      categoryId: categories[1].id,
      authorId: editor2.id,
      status: PostStatus.PUBLISHED,
      featured: true,
      version: "3.0.0",
      fileSize: "720 MB",
      requirements: "Android 7.0+, RAM 3GB",
      developer: "Krafton",
      downloadUrl: "https://example.com/pubg-mod.apk",
      downloadCount: 67800,
      viewCount: 125000,
      publishedAt: new Date("2025-01-15"),
      tags: { connect: [{ id: tags[0].id }, { id: tags[7].id }, { id: tags[19].id }] },
    },
    {
      title: "Free Fire MAX MOD APK - Auto Headshot, Aim Lock",
      slug: "free-fire-max-mod-apk",
      excerpt:
        "Tải Free Fire MAX MOD với tính năng auto headshot, aimlock, wallhack giúp bạn có lợi thế trong mọi trận đấu.",
      content: `
<h2>Free Fire MAX MOD APK</h2>
<p>Free Fire MAX là phiên bản nâng cấp đồ họa của Free Fire. Phiên bản MOD này bổ sung thêm các tính năng hỗ trợ chiến đấu.</p>

<h3>Tính năng MOD:</h3>
<ul>
  <li>🎯 Auto Headshot - Tự động bắn headshot</li>
  <li>🔒 Aim Lock - Khóa mục tiêu</li>
  <li>👻 Wallhack - Xem xuyên tường</li>
  <li>⚡ No Recoil - Không giật súng</li>
  <li>🏃 Speed Boost - Chạy nhanh hơn</li>
</ul>

<h3>Cấu hình khuyến nghị:</h3>
<p>Android 7.0+, RAM 2GB, GPU Mali-G71 hoặc tương đương</p>
      `,
      categoryId: categories[1].id,
      authorId: editor1.id,
      status: PostStatus.PUBLISHED,
      featured: false,
      version: "2.105.1",
      fileSize: "1.2 GB",
      requirements: "Android 7.0+, RAM 2GB",
      developer: "Garena",
      downloadUrl: "https://example.com/ff-max-mod.apk",
      downloadCount: 89300,
      viewCount: 156000,
      publishedAt: new Date("2025-01-14"),
      tags: { connect: [{ id: tags[0].id }, { id: tags[7].id }, { id: tags[6].id }] },
    },
    {
      title: "Minecraft PE MOD - Unlock All, Unlimited Resources",
      slug: "minecraft-pe-mod-unlimited",
      excerpt:
        "Minecraft Pocket Edition MOD với tất cả skin, texture pack, map được mở khóa và tài nguyên không giới hạn.",
      content: `
<h2>Minecraft PE MOD APK</h2>
<p>Khám phá thế giới Minecraft không giới hạn với phiên bản MOD đầy đủ tính năng Premium.</p>

<h3>Tính năng MOD:</h3>
<ul>
  <li>🎨 Unlock all skins và texture packs</li>
  <li>🗺️ Unlock all maps premium</li>
  <li>💎 Tài nguyên không giới hạn</li>
  <li>🛡️ Immortality mode</li>
  <li>✈️ Fly mode trong survival</li>
  <li>📦 Tất cả DLC được mở khóa</li>
</ul>

<h3>Các chế độ chơi:</h3>
<ul>
  <li><strong>Survival:</strong> Sinh tồn, thu thập tài nguyên</li>
  <li><strong>Creative:</strong> Sáng tạo không giới hạn</li>
  <li><strong>Adventure:</strong> Khám phá các map phiêu lưu</li>
  <li><strong>Multiplayer:</strong> Chơi cùng bạn bè</li>
</ul>
      `,
      categoryId: categories[1].id,
      authorId: editor2.id,
      status: PostStatus.PUBLISHED,
      featured: true,
      version: "1.20.80",
      fileSize: "650 MB",
      requirements: "Android 8.0+, RAM 3GB",
      developer: "Mojang",
      downloadUrl: "https://example.com/minecraft-pe-mod.apk",
      downloadCount: 102000,
      viewCount: 198000,
      publishedAt: new Date("2025-01-11"),
      tags: { connect: [{ id: tags[0].id }, { id: tags[4].id }, { id: tags[5].id }] },
    },
    // Tools
    {
      title: "CapCut Pro MOD - Video Editor không logo, Premium features",
      slug: "capcut-pro-mod-apk",
      excerpt:
        "CapCut Pro MOD APK cho phép chỉnh sửa video chuyên nghiệp với tất cả tính năng Premium, không watermark, không quảng cáo.",
      content: `
<h2>CapCut Pro MOD APK</h2>
<p>CapCut là ứng dụng edit video mạnh mẽ, dễ sử dụng. Phiên bản MOD mở khóa tất cả tính năng Pro.</p>

<h3>Tính năng Premium:</h3>
<ul>
  <li>🎬 Không watermark khi export</li>
  <li>🎨 1000+ hiệu ứng và filter Pro</li>
  <li>🎵 Thư viện nhạc bản quyền không giới hạn</li>
  <li>🔊 Audio Ducking tự động</li>
  <li>🌟 Keyframe animation nâng cao</li>
  <li>📤 Export 4K 60fps</li>
  <li>🚫 Không quảng cáo</li>
  <li>💾 Auto-save project</li>
</ul>

<h3>Hướng dẫn sử dụng cơ bản:</h3>
<ol>
  <li>Import video/ảnh từ thư viện</li>
  <li>Cắt, ghép, chỉnh tốc độ video</li>
  <li>Thêm nhạc, hiệu ứng, sticker</li>
  <li>Thêm text, transition</li>
  <li>Export video chất lượng cao</li>
</ol>
      `,
      categoryId: categories[2].id,
      authorId: editor1.id,
      status: PostStatus.PUBLISHED,
      featured: true,
      version: "11.5.0",
      fileSize: "285 MB",
      requirements: "Android 7.0+",
      developer: "Bytedance",
      downloadUrl: "https://example.com/capcut-pro.apk",
      downloadCount: 56700,
      viewCount: 98500,
      publishedAt: new Date("2025-01-13"),
      tags: { connect: [{ id: tags[0].id }, { id: tags[1].id }, { id: tags[12].id }] },
    },
    {
      title: "Remini Pro MOD - AI Photo Enhancer, Unblur Photos",
      slug: "remini-pro-mod-apk",
      excerpt:
        "Remini Pro sử dụng AI để nâng cấp chất lượng ảnh, làm nét ảnh mờ, phục hồi ảnh cũ với độ chi tiết đáng kinh ngạc.",
      content: `
<h2>Remini Pro MOD APK</h2>
<p>Remini là ứng dụng AI nâng cấp ảnh hàng đầu, có thể biến ảnh mờ thành ảnh HD sắc nét.</p>

<h3>Tính năng AI Pro:</h3>
<ul>
  <li>🤖 AI Photo Enhancer - Nâng cấp ảnh tự động</li>
  <li>🔍 Unblur Photos - Làm nét ảnh mờ</li>
  <li>👴 Restore Old Photos - Phục hồi ảnh cũ</li>
  <li>👤 Face Enhancement - Làm đẹp khuôn mặt</li>
  <li>📸 HD Photo Generator</li>
  <li>🎨 Color Correction tự động</li>
  <li>⚡ Xử lý nhanh chóng</li>
  <li>💎 Không giới hạn số lần enhance</li>
</ul>

<h3>Kết quả đạt được:</h3>
<ul>
  <li>Ảnh mờ → Ảnh HD sắc nét</li>
  <li>Ảnh cũ → Ảnh như mới</li>
  <li>Ảnh độ phân giải thấp → HD/4K</li>
  <li>Khuôn mặt mờ → Chi tiết rõ ràng</li>
</ul>
      `,
      categoryId: categories[2].id,
      authorId: editor2.id,
      status: PostStatus.PUBLISHED,
      featured: false,
      version: "3.7.488",
      fileSize: "125 MB",
      requirements: "Android 6.0+",
      developer: "Bending Spoons",
      downloadUrl: "https://example.com/remini-pro.apk",
      downloadCount: 34200,
      viewCount: 67800,
      publishedAt: new Date("2025-01-09"),
      tags: { connect: [{ id: tags[0].id }, { id: tags[1].id }, { id: tags[11].id }] },
    },
    {
      title: "1.1.1.1 VPN Premium - Warp+ Unlimited Data",
      slug: "1111-vpn-premium-warp-plus",
      excerpt:
        "1.1.1.1 VPN với Warp+ Premium cho tốc độ nhanh hơn, bảo mật tốt hơn và dữ liệu không giới hạn. VPN nhanh nhất hiện nay.",
      content: `
<h2>1.1.1.1 VPN Warp+ Premium</h2>
<p>Cloudflare's 1.1.1.1 là DNS nhanh nhất thế giới. Warp+ là VPN tích hợp giúp tăng tốc và bảo mật kết nối internet.</p>

<h3>Tính năng Premium Warp+:</h3>
<ul>
  <li>⚡ Tốc độ cực nhanh (nhanh hơn VPN thông thường)</li>
  <li>🔒 Mã hóa dữ liệu an toàn</li>
  <li>🌐 Không giới hạn bandwidth</li>
  <li>🚫 Chặn tracking, malware</li>
  <li>📱 Tiết kiệm pin và dữ liệu</li>
  <li>🌍 Kết nối toàn cầu</li>
  <li>🎮 Giảm ping khi chơi game</li>
  <li>📺 Mở khóa nội dung bị chặn</li>
</ul>
      `,
      categoryId: categories[2].id,
      authorId: editor1.id,
      status: PostStatus.PUBLISHED,
      featured: false,
      version: "6.32",
      fileSize: "78 MB",
      requirements: "Android 5.0+",
      developer: "Cloudflare Inc",
      downloadUrl: "https://example.com/1111-warp-plus.apk",
      downloadCount: 28900,
      viewCount: 52300,
      publishedAt: new Date("2025-01-07"),
      tags: { connect: [{ id: tags[0].id }, { id: tags[1].id }, { id: tags[14].id }] },
    },
    // News & Guides
    {
      title: "Top 10 ứng dụng Android cần thiết nhất năm 2025",
      slug: "top-10-ung-dung-android-2025",
      excerpt:
        "Tổng hợp 10 ứng dụng Android không thể thiếu trên smartphone của bạn trong năm 2025. Từ công cụ năng suất đến giải trí.",
      content: `
<h2>10 ứng dụng Android tốt nhất 2025</h2>
<p>Danh sách các ứng dụng cần thiết giúp tối ưu trải nghiệm smartphone của bạn.</p>

<h3>1. Nova Launcher</h3>
<p>Launcher tùy biến tốt nhất cho Android với nhiều tính năng độc đáo.</p>

<h3>2. Tasker</h3>
<p>Tự động hóa mọi thứ trên Android theo điều kiện bạn đặt.</p>

<h3>3. Solid Explorer</h3>
<p>File manager mạnh mẽ với giao diện Material Design đẹp mắt.</p>

<h3>4. Bitwarden</h3>
<p>Quản lý mật khẩu miễn phí, mã nguồn mở và bảo mật cao.</p>

<h3>5. Kore (Kodi Remote)</h3>
<p>Điều khiển Kodi media center từ xa cực kỳ tiện lợi.</p>

<h3>6. Sleep as Android</h3>
<p>Ứng dụng theo dõi giấc ngủ thông minh nhất.</p>

<h3>7. Podcast Addict</h3>
<p>Nghe podcast, audiobook với tính năng đầy đủ nhất.</p>

<h3>8. Authy</h3>
<p>Bảo mật 2FA tốt nhất, đồng bộ đa thiết bị.</p>

<h3>9. Snapseed</h3>
<p>Chỉnh sửa ảnh chuyên nghiệp từ Google, hoàn toàn miễn phí.</p>

<h3>10. YouTube Vanced</h3>
<p>Xem YouTube không quảng cáo, phát nền, tải video.</p>
      `,
      categoryId: categories[3].id,
      authorId: editor2.id,
      status: PostStatus.PUBLISHED,
      featured: false,
      publishedAt: new Date("2025-01-16"),
      tags: { connect: [{ id: tags[2].id }, { id: tags[16].id }] },
    },
    {
      title: "Hướng dẫn cài đặt MOD APK an toàn cho người mới bắt đầu",
      slug: "huong-dan-cai-mod-apk-an-toan",
      excerpt:
        "Hướng dẫn chi tiết cách tải và cài đặt file APK/MOD APK an toàn trên Android. Tránh virus, malware và bảo vệ thiết bị.",
      content: `
<h2>Cách cài đặt MOD APK an toàn</h2>

<h3>Bước 1: Chuẩn bị</h3>
<ol>
  <li>Sao lưu dữ liệu quan trọng</li>
  <li>Cài đặt antivirus (nếu cần)</li>
  <li>Kiểm tra nguồn tải file đáng tin cậy</li>
</ol>

<h3>Bước 2: Bật cài đặt từ nguồn không xác định</h3>
<ul>
  <li>Vào <strong>Cài đặt → Bảo mật</strong></li>
  <li>Bật "<strong>Nguồn không xác định</strong>" hoặc "<strong>Unknown Sources</strong>"</li>
  <li>Với Android 8.0+: Cho phép từng ứng dụng (Chrome, File Manager...)</li>
</ul>

<h3>Bước 3: Tải file APK</h3>
<ul>
  <li>Tải từ nguồn tin cậy</li>
  <li>Kiểm tra kích thước file (file quá nhỏ có thể là fake)</li>
  <li>Scan virus bằng VirusTotal hoặc antivirus</li>
</ul>

<h3>Bước 4: Cài đặt</h3>
<ol>
  <li>Mở file APK vừa tải</li>
  <li>Nhấn "Cài đặt"</li>
  <li>Chờ quá trình hoàn tất</li>
  <li>Nhấn "Mở" để chạy ứng dụng</li>
</ol>

<h3>⚠️ Lưu ý an toàn:</h3>
<ul>
  <li>✅ Chỉ tải từ nguồn uy tín</li>
  <li>✅ Đọc quyền ứng dụng yêu cầu</li>
  <li>✅ Scan virus trước khi cài</li>
  <li>❌ Không cài APK từ email lạ</li>
  <li>❌ Không cài APK yêu cầu quyền lạ</li>
  <li>❌ Không cài từ nguồn không rõ ràng</li>
</ul>
      `,
      categoryId: categories[4].id,
      authorId: editor1.id,
      status: PostStatus.PUBLISHED,
      featured: false,
      publishedAt: new Date("2025-01-05"),
      tags: { connect: [{ id: tags[0].id }, { id: tags[15].id }] },
    },
    // Draft & Scheduled
    {
      title: "Instagram Plus MOD - Download ảnh, video, story, reels",
      slug: "instagram-plus-mod-apk",
      excerpt: "Instagram MOD cho phép tải ảnh, video, story, reels về máy. Zoom ảnh profile, xem story ẩn danh.",
      content: `<h2>Instagram Plus MOD</h2><p>Tải mọi thứ từ Instagram về máy...</p>`,
      categoryId: categories[0].id,
      authorId: editor2.id,
      status: PostStatus.DRAFT,
      version: "298.0",
      fileSize: "68 MB",
      requirements: "Android 6.0+",
      tags: { connect: [{ id: tags[0].id }, { id: tags[10].id }] },
    },
    {
      title: "TikTok Pro MOD - Tải video không watermark, xem ẩn danh",
      slug: "tiktok-pro-mod-apk",
      excerpt: "TikTok MOD xem video ẩn danh, tải video không logo, không giới hạn.",
      content: `<h2>TikTok Pro</h2><p>Xem và tải TikTok thoải mái...</p>`,
      categoryId: categories[0].id,
      authorId: editor1.id,
      status: PostStatus.SCHEDULED,
      publishedAt: new Date("2025-01-20"),
      version: "33.2.4",
      fileSize: "145 MB",
      requirements: "Android 5.0+",
      tags: { connect: [{ id: tags[0].id }, { id: tags[18].id }] },
    },
  ];

  let createdPosts = 0;
  for (const postData of postsData) {
    await prisma.post.upsert({
      where: { slug: postData.slug },
      update: {},
      create: postData as any,
    });
    createdPosts++;
  }

  console.log(`✅ Created ${createdPosts} posts`);

  // ============================================
  // 5. CREATE COMMENTS
  // ============================================
  console.log("💬 Creating comments...");

  const posts = await prisma.post.findMany({ where: { status: PostStatus.PUBLISHED } });

  const commentsData = [
    {
      content: "App này xịn quá! Mình đã dùng được 3 tháng rồi, chưa bị văng lần nào.",
      postId: posts[0].id,
      authorId: users[0].id,
      status: CommentStatus.APPROVED,
    },
    {
      content: "Link download bị lỗi rồi admin ơi, fix giúp mình với!",
      postId: posts[0].id,
      authorId: users[1].id,
      status: CommentStatus.PENDING,
    },
    {
      content: "Cảm ơn admin đã share. App chạy mượt trên Samsung A54 của mình.",
      postId: posts[1].id,
      authorId: users[2].id,
      status: CommentStatus.APPROVED,
    },
    {
      content: "Có bản cho iOS không admin?",
      postId: posts[1].id,
      authorId: users[3].id,
      status: CommentStatus.APPROVED,
    },
    {
      content: "MOD này có an toàn không vậy mọi người? Sợ bị hack tài khoản quá.",
      postId: posts[2].id,
      authorId: users[4].id,
      status: CommentStatus.APPROVED,
    },
    {
      content: "Mình dùng rồi, an toàn mà bạn. Nhưng nên dùng tài khoản phụ cho chắc.",
      postId: posts[2].id,
      authorId: users[0].id,
      status: CommentStatus.APPROVED,
    },
    {
      content: "Link die rồi admin ơi!",
      postId: posts[3].id,
      authorId: users[1].id,
      status: CommentStatus.SPAM,
    },
    {
      content: "Game hay nhưng hơi nặng, điện thoại mình bị nóng máy.",
      postId: posts[4].id,
      authorId: users[2].id,
      status: CommentStatus.APPROVED,
    },
  ];

  let createdComments = 0;
  for (const commentData of commentsData) {
    await prisma.comment.create({ data: commentData });
    createdComments++;
  }

  // Create nested reply
  const parentComment = await prisma.comment.findFirst({
    where: { content: { contains: "Link download bị lỗi" } },
  });

  if (parentComment) {
    await prisma.comment.create({
      data: {
        content: "Link vẫn hoạt động bình thường bạn nhé. Bạn thử xóa cache trình duyệt xem.",
        postId: parentComment.postId,
        authorId: editor1.id,
        parentId: parentComment.id,
        status: CommentStatus.APPROVED,
      },
    });
    createdComments++;
  }

  console.log(`✅ Created ${createdComments} comments`);

  console.log("\n✨ Seed completed successfully!");
  console.log(`
📊 Summary:
- Users: ${users.length + 3} (1 Super Admin, 2 Editors, ${users.length} Users)
- Categories: ${categories.length}
- Tags: ${tags.length}
- Posts: ${createdPosts}
- Comments: ${createdComments}

🔐 Login credentials:
- Email: admin@blogmodapk.com
- Password: Admin@123

🚀 You can now run: npx prisma studio
  `);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seed error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
