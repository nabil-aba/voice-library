const SPEAKERS = [
  { name: "Suguru Geto", fileKey: "geto", extension: "jpg", isAvailable: true },
  {
    name: "Roronoa Zoro",
    fileKey: "zoro",
    extension: "jpg",
    isAvailable: true,
  },
  { name: "Gojo Satoru", fileKey: "gojo", extension: "png", isAvailable: true },
  {
    name: "Ryomen Sukuna",
    fileKey: "sukuna",
    extension: "jpg",
    isAvailable: true,
  },
  { name: "Luffy", fileKey: "luffy", extension: "jpg", isAvailable: true },
  {
    name: "Itachi Uchiha",
    fileKey: "itachi",
    extension: "jpg",
    isAvailable: true,
  },
  {
    name: "Sasuke Uchiha",
    fileKey: "sasuke",
    extension: "jpg",
    isAvailable: true,
  },
  {
    name: "Uzumaki Naruto",
    fileKey: "naruto",
    extension: "jpg",
    isAvailable: true,
  },
  {
    name: "Yuta Okkotsu",
    fileKey: "yuta",
    extension: "jpg",
    isAvailable: false,
  },
];

const RAW_SCRIPTS = [
  {
    text: "I want to live! Take me out to sea with you!",
    tags: ["One Piece", "Emotional"],
    exclude: ["naruto"],
  },
  {
    text: "I will never give up on my dreams, no matter how hard it gets!",
    tags: ["Naruto", "Motivation"],
    exclude: ["naruto"],
  },
  {
    text: "Don't be sorry. Be better.",
    tags: ["Jujutsu Kaisen", "Arrogant"],
    exclude: ["naruto"],
  },
  {
    text: "I have chosen my path, and I have no regrets.",
    tags: ["Resolve", "Drama", "Destiny", "Finality"],
  },
  {
    text: "I don't care how strong you are, I will never let you hurt my friends!",
    tags: ["Protective", "Friendship", "Battle", "Aggressive"],
  },
  {
    text: "Silence is the most powerful scream.",
    tags: ["Mysterious", "Deep"],
  },
];

export const SCRIPT_LIBRARY = RAW_SCRIPTS.map((script, index) => {
  const scriptId = `s_${String(index + 1).padStart(3, "0")}`;

  const activeSpeakers = SPEAKERS.filter((speaker) => {
    if (script.only) {
      return script.only.includes(speaker.fileKey);
    }

    if (!speaker.isAvailable) {
      return false;
    }

    if (script.exclude && script.exclude.includes(speaker.fileKey)) {
      return false;
    }

    return true;
  });

  return {
    id: scriptId,
    text: script.text,
    tags: script.tags,
    variations: activeSpeakers.map((speaker) => ({
      id: `${scriptId}_${speaker.fileKey}`,
      speaker: speaker.name,
      tech: "IndexTTS2",
      avatar: `/assets/avatars/${speaker.fileKey}.${speaker.extension}`,
      url: `/assets/${scriptId}/${speaker.fileKey}.wav`,
    })),
  };
});
