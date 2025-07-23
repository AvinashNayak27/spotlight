"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, Moon, Sun, Users, Verified, TrendingUp, Info, User, Trophy, DollarSign, RefreshCw } from "lucide-react"
import { useTheme } from "next-themes"

interface User {
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

interface CachedData {
  users: User[]
  timestamp: number
}

// Cache duration: 2 minutes
const CACHE_DURATION = 2 * 60 * 1000
const CACHE_KEY = 'spotlight_users_cache'

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showInstructions, setShowInstructions] = useState(false)
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Load cached data from localStorage
  const loadCachedData = useCallback((): CachedData | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY)
      if (!cached) return null
      
      const data: CachedData = JSON.parse(cached)
      const now = Date.now()
      
      // Check if cache is still valid
      if (now - data.timestamp > CACHE_DURATION) {
        localStorage.removeItem(CACHE_KEY)
        return null
      }
      
      return data
    } catch (error) {
      console.error("Error loading cached data:", error)
      localStorage.removeItem(CACHE_KEY)
      return null
    }
  }, [])

  // Save data to cache
  const saveCachedData = useCallback((users: User[]) => {
    try {
      const cacheData: CachedData = {
        users,
        timestamp: Date.now()
      }
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData))
    } catch (error) {
      console.error("Error saving cached data:", error)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  const fetchUsers = async () => {
    try {
      // First, try to load from cache
      const cachedData = loadCachedData()
      if (cachedData) {
        setUsers(cachedData.users)
        setIsLoading(false)
        return
      }

      // If no valid cache, fetch from API
      const response = await fetch("/api/users")
      const data = await response.json()
      
      if (response.ok) {
        setUsers(data)
        // Save to cache
        saveCachedData(data)
      } else {
        console.error("API Error:", data.error)
        setUsers([])
      }
    } catch (error) {
      console.error("Error fetching users:", error)
      setUsers([])
    } finally {
      setIsLoading(false)
    }
  }

  // Function to force refresh data (bypass cache)
  const refreshData = async () => {
    setIsLoading(true)
    localStorage.removeItem(CACHE_KEY)
    await fetchUsers()
  }

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/${searchQuery.trim()}`)
    }
  }

  const handleUserClick = (username: string) => {
    router.push(`/${username}`)
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const handleProfileClick = () => {
    router.push("/user")
  }

  const formatReward = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`
  }

  const getRankColor = (rank: number) => {
    if (rank === 1) return "from-yellow-400 to-yellow-600"
    if (rank === 2) return "from-gray-300 to-gray-500"
    if (rank === 3) return "from-orange-400 to-orange-600"
    if (rank <= 10) return "from-blue-400 to-blue-600"
    return "from-purple-400 to-purple-600"
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="glass-morphism dark:glass-morphism-dark rounded-3xl p-8 animate-scale-in">
          <div className="text-center">
            <p className="text-muted-foreground font-medium">Loading Spotlight...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Dynamic Island Header */}
      <div className="animate-slide-in-down">
        <div className="container max-w-md mx-auto px-4 py-4">
          <div className="glass-morphism dark:glass-morphism-dark rounded-3xl p-4 liquid-hover shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Spotlight
                  </h1>
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg blur opacity-30"></div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setShowInstructions(!showInstructions)} 
                  className="h-8 w-8 rounded-full liquid-press hover:bg-white/20 dark:hover:bg-black/20 transition-all duration-300"
                >
                  <Info className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                {/* <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={refreshData} 
                  disabled={isLoading}
                  className="h-10 w-10 rounded-full liquid-press hover:bg-white/20 dark:hover:bg-black/20 transition-all duration-300 relative overflow-hidden disabled:opacity-50"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-400 opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                </Button> */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleTheme} 
                  className="h-10 w-10 rounded-full liquid-press hover:bg-white/20 dark:hover:bg-black/20 transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-pink-400 opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
                  {mounted && theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleProfileClick} 
                  className="h-10 w-10 rounded-full liquid-press border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-black/20 transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
                  <User className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Liquid Search Bar */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-sm"></div>
                <div className="relative glass-morphism dark:glass-morphism-dark rounded-2xl overflow-hidden">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                  <Input
                    placeholder="Search username..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-4 py-3 bg-transparent border-0 focus:ring-2 focus:ring-blue-500/30 rounded-2xl transition-all duration-300"
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>
              </div>
              <Button 
                onClick={handleSearch} 
                disabled={!searchQuery.trim()}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-0 liquid-press disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative font-medium">Go</span>
              </Button>
            </div>

            {/* Liquid Instructions Dropdown */}
            {showInstructions && (
              <div className="mt-4 glass-morphism dark:glass-morphism-dark rounded-2xl p-4 animate-slide-in-up border border-white/10">
                <h4 className="font-semibold text-sm mb-3 text-blue-600 dark:text-blue-400">How it works</h4>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-purple-400"></div>
                    <p>Browse Farcaster Spotlight</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-400 to-pink-400"></div>
                    <p>Click on any user to see their top and first casts</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-pink-400 to-orange-400"></div>
                    <p>Use search to find any Farcaster username</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pb-8">
        <div className="container max-w-md mx-auto px-4">
          {/* Spotlight Section */}
          <div className="animate-slide-in-up" style={{ animationDelay: '0.2s' }}>

            <div className="flex items-center gap-3 mb-6">
              {/* <div className="relative">
                <Trophy className="h-6 w-6 text-yellow-500" />
                <div className="absolute -inset-1 bg-yellow-500/20 rounded-full blur opacity-50"></div>
              </div> */}
                {/* <h3 className="font-bold text-lg bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                  Spotlight
                </h3> */}
            </div>

            {users.length === 0 ? (
              <div className="text-center py-8">
                <div className="glass-morphism dark:glass-morphism-dark rounded-2xl p-6">
                  <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No spotlight data available</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {users.map((user, index) => (
                  <div
                    key={user.username}
                    className="animate-slide-in-up"
                    style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                  >
                    <Card
                      className="cursor-pointer liquid-hover liquid-press glass-morphism dark:glass-morphism-dark border-white/20 dark:border-white/10 rounded-3xl overflow-hidden transition-all duration-300 relative group"
                      onClick={() => handleUserClick(user.username)}
                    >
                      {/* Gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      <CardContent className="p-5 relative z-10">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <Avatar className="h-14 w-14 ring-2 ring-white/20 dark:ring-white/10">
                              <AvatarImage src={user.avatar || "/placeholder.svg"} />
                              <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white font-semibold">
                                {user.displayName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            {user.verified && (
                              <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                                <Verified className="h-3 w-3 text-white" />
                              </div>
                            )}
                            {/* Rank Badge */}
                            {/* <div className={`absolute -top-2 -left-2 bg-gradient-to-r ${getRankColor(user.rank)} rounded-full p-1.5 shadow-lg`}>
                              <span className="text-white text-xs font-bold">#{user.rank}</span>
                            </div> */}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-bold text-base truncate">{user.displayName}</h4>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2 truncate">@{user.username}</p>
                            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{user.bio}</p>
                            
                            {/* Rewards Info */}
                            {/* <div className="flex items-center gap-3 mt-2">
                              <div className="flex items-center gap-1">
                                <TrendingUp className="h-3 w-3 text-green-500" />
                                <span className="text-xs font-medium text-green-600 dark:text-green-400">
                                  {user.score.toLocaleString()} pts
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-3 w-3 text-yellow-500" />
                                <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400">
                                  {formatReward(user.rewardCents)}
                                </span>
                              </div>
                            </div> */}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
