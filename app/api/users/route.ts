import { NextResponse } from "next/server"

interface Winner {
  fid: number
  score: number
  rank: number
  rewardCents: number
  username: string
  walletAddress: string
}

interface CreatorRewardsResponse {
  result: {
    history: {
      periodStartTimestamp: number
      periodEndTimestamp: number
      winners: Winner[]
    }
  }
}

interface UserProfile {
  fid: number
  displayName: string
  profile: {
    bio: {
      text: string
      mentions: string[]
      channelMentions: string[]
    }
    location: {
      placeId: string
      description: string
    }
    earlyWalletAdopter: boolean
    accountLevel: string
    url?: string
  }
  followerCount: number
  followingCount: number
  username: string
  pfp: {
    url: string
    verified: boolean
  }
  connectedAccounts: Array<{
    connectedAccountId: string
    platform: string
    username: string
    expired: boolean
  }>
  viewerContext: {
    following: boolean
    followedBy: boolean
    canSendDirectCasts: boolean
    enableNotifications: boolean
    hasUploadedInboxKeys: boolean
  }
}

interface UserResponse {
  result: {
    user: UserProfile
    collectionsOwned: any[]
    extras: {
      fid: number
      custodyAddress: string
      ethWallets: string[]
      solanaWallets: string[]
      walletLabels: Array<{
        address: string
        labels: string[]
      }>
      v2: boolean
      publicSpamLabel: string
    }
  }
}

interface EnhancedUser {
  username: string
  displayName: string
  avatar: string
  bio: string
  followers: string
  following: string
  verified: boolean
  joinDate: string
  fid: number
  score: number
  rank: number
  rewardCents: number
  walletAddress: string
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

export async function GET() {
  try {
    // Fetch creator rewards data
    const rewardsResponse = await fetch('https://api.farcaster.xyz/v1/creator-rewards-winner-history')
    
    if (!rewardsResponse.ok) {
      throw new Error(`Failed to fetch creator rewards: ${rewardsResponse.status}`)
    }

    const rewardsData: CreatorRewardsResponse = await rewardsResponse.json()
    const winners = rewardsData.result.history.winners

    // Fetch user details for each winner
    const userPromises = winners.map(async (winner) => {
      try {
        const userResponse = await fetch(`https://api.farcaster.xyz/v2/user-by-username?username=${winner.username}`)
        
        if (!userResponse.ok) {
          console.error(`Failed to fetch user ${winner.username}: ${userResponse.status}`)
          return null
        }

        const userData: UserResponse = await userResponse.json()
        const user = userData.result.user

        return {
          username: winner.username,
          displayName: user.displayName,
          avatar: user.pfp.url || "/placeholder.svg?height=80&width=80",
          bio: user.profile.bio.text || "No bio available",
          followers: formatNumber(user.followerCount),
          following: formatNumber(user.followingCount),
          verified: user.pfp.verified,
          joinDate: "Creator rewards winner",
          fid: winner.fid,
          score: winner.score,
          rank: winner.rank,
          rewardCents: winner.rewardCents,
          walletAddress: winner.walletAddress
        } as EnhancedUser
      } catch (error) {
        console.error(`Error fetching user ${winner.username}:`, error)
        return null
      }
    })

    const users = await Promise.all(userPromises)
    const validUsers = users.filter((user): user is EnhancedUser => user !== null)

    return NextResponse.json(validUsers)
  } catch (error) {
    console.error("Error in API route:", error)
    return NextResponse.json(
      { error: "Failed to fetch creator rewards data" },
      { status: 500 }
    )
  }
}
