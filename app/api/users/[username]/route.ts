import { NextResponse } from "next/server"

const mockUserData: Record<string, any> = {
  dwr: {
    username: "dwr",
    displayName: "Dan Romero",
    avatar: "/placeholder.svg?height=80&width=80",
    bio: "Co-founder of Farcaster. Building the future of decentralized social.",
    followers: "125.2K",
    following: "892",
    verified: true,
    joinDate: "Jan 2022",
    topCasts: [
      {
        id: 1,
        text: "The future of social media is decentralized. We're building the infrastructure to make it happen.",
        timestamp: "2h ago",
        likes: 1247,
        recasts: 342,
        replies: 89,
        engagement: 1678,
      },
      {
        id: 2,
        text: "Just shipped a major update to the Farcaster protocol. Excited to see what developers build next! 🚀",
        timestamp: "1d ago",
        likes: 892,
        recasts: 234,
        replies: 156,
        engagement: 1282,
      },
      {
        id: 3,
        text: "Web3 social is not about replacing existing platforms, it's about giving users ownership of their data and relationships.",
        timestamp: "3d ago",
        likes: 756,
        recasts: 189,
        replies: 67,
        engagement: 1012,
      },
    ],
    firstCasts: [
      {
        id: 4,
        text: "Hello Farcaster! Excited to be building the future of decentralized social media.",
        timestamp: "Jan 15, 2022",
        likes: 234,
        recasts: 89,
        replies: 45,
        engagement: 368,
      },
      {
        id: 5,
        text: "Testing out this new protocol we've been working on. The possibilities are endless!",
        timestamp: "Jan 16, 2022",
        likes: 156,
        recasts: 34,
        replies: 23,
        engagement: 213,
      },
      {
        id: 6,
        text: "Decentralization isn't just a buzzword - it's the foundation of a more open internet.",
        timestamp: "Jan 18, 2022",
        likes: 189,
        recasts: 67,
        replies: 34,
        engagement: 290,
      },
    ],
  },
  vitalik: {
    username: "vitalik",
    displayName: "Vitalik Buterin",
    avatar: "/placeholder.svg?height=80&width=80",
    bio: "Ethereum co-founder. Interested in crypto, governance, and coordination.",
    followers: "89.1K",
    following: "234",
    verified: true,
    joinDate: "Mar 2022",
    topCasts: [
      {
        id: 7,
        text: "Ethereum's transition to proof-of-stake has been one of the most complex technical upgrades in blockchain history.",
        timestamp: "4h ago",
        likes: 2156,
        recasts: 567,
        replies: 234,
        engagement: 2957,
      },
      {
        id: 8,
        text: "The future of governance lies in finding the right balance between efficiency and decentralization.",
        timestamp: "2d ago",
        likes: 1834,
        recasts: 445,
        replies: 189,
        engagement: 2468,
      },
    ],
    firstCasts: [
      {
        id: 9,
        text: "Excited to be here on Farcaster! Looking forward to more decentralized conversations.",
        timestamp: "Mar 10, 2022",
        likes: 567,
        recasts: 234,
        replies: 89,
        engagement: 890,
      },
    ],
  },
}

export async function GET(request: Request, { params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const userData = mockUserData[username]

  if (!userData) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  return NextResponse.json(userData)
}
