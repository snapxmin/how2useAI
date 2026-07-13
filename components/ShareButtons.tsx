"use client";

interface ShareButtonsProps {
  title: string;
  url: string;
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  const shareLinks = [
    {
      name: "微信",
      href: "#",
      onClick: () => {
        navigator.clipboard.writeText(url);
        alert("链接已复制，可粘贴到微信分享");
      },
      icon: "💬",
    },
    {
      name: "微博",
      href: `https://service.weibo.com/share/share.php?title=${encodedTitle}&url=${encodedUrl}`,
      icon: "📢",
    },
    {
      name: "Twitter",
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      icon: "🐦",
    },
    {
      name: "复制链接",
      href: "#",
      onClick: () => {
        navigator.clipboard.writeText(url);
        alert("链接已复制");
      },
      icon: "🔗",
    },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-slate-500">分享：</span>
      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target={link.onClick ? undefined : "_blank"}
          rel="noopener noreferrer"
          onClick={(e) => {
            if (link.onClick) {
              e.preventDefault();
              link.onClick();
            }
          }}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm transition-colors hover:bg-brand-100"
          title={link.name}
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
}
