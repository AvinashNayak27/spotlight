import { NextResponse } from "next/server"

const mockUsers = [
  {
    username: "dwr",
    displayName: "Dan Romero",
    avatar: "/placeholder.svg?height=80&width=80",
    bio: "Co-founder of Farcaster. Building the future of decentralized social.",
    followers: "125.2K",
    following: "892",
    verified: true,
    joinDate: "Jan 2022",
  },
  {
    username: "vitalik",
    displayName: "Vitalik Buterin",
    avatar: "/placeholder.svg?height=80&width=80",
    bio: "Ethereum co-founder. Interested in crypto, governance, and coordination.",
    followers: "89.1K",
    following: "234",
    verified: true,
    joinDate: "Mar 2022",
  },
  {
    username: "jessepollak",
    displayName: "Jesse Pollak",
    avatar: "/placeholder.svg?height=80&width=80",
    bio: "Building Base at Coinbase. Onchain is the next online.",
    followers: "67.8K",
    following: "456",
    verified: true,
    joinDate: "Feb 2022",
  },
  {
    username: "balajis",
    displayName: "Balaji Srinivasan",
    avatar: "/placeholder.svg?height=80&width=80",
    bio: "Former CTO of Coinbase. Angel investor and entrepreneur.",
    followers: "156.3K",
    following: "1.2K",
    verified: true,
    joinDate: "Apr 2022",
  },
  {
    username: "linda",
    displayName: "Linda Xie",
    avatar: "/placeholder.svg?height=80&width=80",
    bio: "Co-founder of Scalar Capital. Previously PM at Coinbase.",
    followers: "45.6K",
    following: "789",
    verified: true,
    joinDate: "May 2022",
  },
  {
    username: "punk6529",
    displayName: "6529",
    avatar: "/placeholder.svg?height=80&width=80",
    bio: "NFT collector and advocate for decentralization and open metaverse.",
    followers: "78.9K",
    following: "567",
    verified: true,
    joinDate: "Jun 2022",
  },
]

export async function GET() {
  return NextResponse.json(mockUsers)
}
