"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Repeat2,
  Zap,
  Calendar,
  TrendingUp,
  Bookmark,
  Verified,
  Moon,
  Sun,
} from "lucide-react"
import { useTheme } from "next-themes"

interface Cast {
  id: number
  text: string
  timestamp: string
  likes: number
  recasts: number
  replies: number
  engagement: number
}

interface UserData {
  username: string
  displayName: string
  avatar: string
  bio: string
  followers: string
  following: string
  verified: boolean
  joinDate: string
  topCasts: Cast[]
  firstCasts: Cast[]
}

export default function UserPage({ params }: { params: Promise<{ username: string }> }) {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [collectedCasts, setCollectedCasts] = useState<number[]>([])
  const [mounted, setMounted] = useState(false)
  const [username, setUsername] = useState<string>("")
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params
      setUsername(resolvedParams.username)
    }
    getParams()
  }, [params])

  useEffect(() => {
    if (username) {
      fetchUserData(username)
    }
  }, [username])

  useEffect(() => {
    setMounted(true)
  }, [])

  const fetchUserData = async (username: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch(`/api/users/${username}`)

      if (!response.ok) {
        throw new Error("User not found")
      }

      const data = await response.json()
      setUserData(data)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load user data")
    } finally {
      setIsLoading(false)
    }
  }

  const toggleCollect = (castId: number) => {
    setCollectedCasts((prev) => (prev.includes(castId) ? prev.filter((id) => id !== castId) : [...prev, castId]))
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const CastCard = ({ cast, showEngagement = true }: { cast: Cast; showEngagement?: boolean }) => (
    <Card className="mb-4 glass-morphism dark:glass-morphism-dark border-white/20 dark:border-white/10 rounded-3xl overflow-hidden liquid-hover group transition-all duration-300">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <CardHeader className="pb-3 relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-12 w-12 ring-2 ring-white/20 dark:ring-white/10">
                <AvatarImage src={userData?.avatar || "/placeholder.svg"} />
                <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white font-semibold">
                  {userData?.displayName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              {userData?.verified && (
                <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                  <Verified className="h-3 w-3 text-white" />
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <div className="font-bold text-sm">{userData?.displayName}</div>
              </div>
              <div className="text-xs text-muted-foreground">@{userData?.username}</div>
            </div>
          </div>
          <div className="glass-morphism dark:glass-morphism-dark rounded-xl px-2 py-1">
            <div className="text-xs text-muted-foreground font-medium">{cast.timestamp}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 relative z-10">
        <p className="text-sm mb-4 leading-relaxed">{cast.text}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-muted-foreground liquid-hover">
              <Heart className="h-4 w-4" />
              <span className="text-xs font-medium">{cast.likes}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground liquid-hover">
              <Repeat2 className="h-4 w-4" />
              <span className="text-xs font-medium">{cast.recasts}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground liquid-hover">
              <MessageCircle className="h-4 w-4" />
              <span className="text-xs font-medium">{cast.replies}</span>
            </div>
            {showEngagement && (
              <div className="glass-morphism dark:glass-morphism-dark rounded-xl px-2 py-1">
                <Badge variant="secondary" className="text-xs bg-transparent border-0">
                  <Zap className="h-3 w-3 mr-1" />
                  {cast.engagement}
                </Badge>
              </div>
            )}
          </div>

          <Button
            size="sm"
            variant={collectedCasts.includes(cast.id) ? "default" : "outline"}
            onClick={() => toggleCollect(cast.id)}
            className={`h-8 rounded-xl liquid-press transition-all duration-300 ${
              collectedCasts.includes(cast.id)
                ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-0"
                : "border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-black/20"
            }`}
          >
            <Bookmark className="h-3 w-3 mr-1" />
            {collectedCasts.includes(cast.id) ? "Collected" : "Collect"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="glass-morphism dark:glass-morphism-dark rounded-3xl p-8 animate-scale-in">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary mx-auto mb-4"></div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-20 animate-pulse-glow"></div>
            </div>
            <p className="text-muted-foreground font-medium">Loading user data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !userData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="glass-morphism dark:glass-morphism-dark rounded-3xl p-8 animate-scale-in text-center">
          <h2 className="text-xl font-bold mb-2 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">User Not Found</h2>
          <p className="text-muted-foreground mb-6">{error || "This user does not exist"}</p>
          <Button 
            onClick={() => router.push("/")}
            className="rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-0 liquid-press transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
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
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => router.push("/")} 
                className="h-10 w-10 rounded-full liquid-press hover:bg-white/20 dark:hover:bg-black/20 transition-all duration-300"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                @{userData.username}
              </h1>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleTheme} 
                className="h-10 w-10 rounded-full liquid-press hover:bg-white/20 dark:hover:bg-black/20 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-pink-400 opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
                {mounted && theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pb-8">
        <div className="container max-w-md mx-auto px-4">
          {/* User Profile Card */}
          <div className="animate-slide-in-up mb-6">
            <Card className="glass-morphism dark:glass-morphism-dark border-white/20 dark:border-white/10 rounded-3xl overflow-hidden liquid-hover">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-pink-500/10"></div>
              <CardContent className="pt-6 relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    <Avatar className="h-20 w-20 ring-4 ring-white/20 dark:ring-white/10">
                      <AvatarImage src={userData.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white font-bold text-xl">
                        {userData.displayName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    {userData.verified && (
                      <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-1.5">
                        <Verified className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className="font-bold text-xl">{userData.displayName}</h2>
                    </div>
                    <p className="text-muted-foreground font-medium">@{userData.username}</p>
                    <p className="text-sm mt-2 leading-relaxed">{userData.bio}</p>
                  </div>
                </div>

                <div className="flex gap-6 text-sm mb-4">
                  <div className="glass-morphism dark:glass-morphism-dark rounded-2xl px-3 py-2">
                    <span className="font-bold">{userData.followers}</span>
                    <span className="text-muted-foreground ml-1">followers</span>
                  </div>
                  <div className="glass-morphism dark:glass-morphism-dark rounded-2xl px-3 py-2">
                    <span className="font-bold">{userData.following}</span>
                    <span className="text-muted-foreground ml-1">following</span>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground font-medium">
                  <Calendar className="h-3 w-3 inline mr-1" />
                  Joined {userData.joinDate}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Liquid Tabs */}
          <div className="animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
            <Tabs defaultValue="top" className="w-full">
              <div className="glass-morphism dark:glass-morphism-dark rounded-3xl p-2 mb-6">
                <TabsList className="grid w-full grid-cols-2 bg-transparent gap-2">
                  <TabsTrigger 
                    value="top" 
                    className="flex items-center gap-2 rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300 liquid-press"
                  >
                    <TrendingUp className="h-4 w-4" />
                    Top Casts
                  </TabsTrigger>
                  <TabsTrigger 
                    value="first" 
                    className="flex items-center gap-2 rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300 liquid-press"
                  >
                    <Calendar className="h-4 w-4" />
                    First Casts
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="top" className="space-y-0">
                <div className="mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
                    <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wide">Top Casts by Engagement</h3>
                  </div>
                </div>
                <div className="space-y-4">
                  {userData.topCasts.map((cast, index) => (
                    <div
                      key={cast.id}
                      className="animate-slide-in-up"
                      style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                    >
                      <CastCard cast={cast} showEngagement={true} />
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="first" className="space-y-0">
                <div className="mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full"></div>
                    <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wide">First Casts Ever</h3>
                  </div>
                </div>
                <div className="space-y-4">
                  {userData.firstCasts.map((cast, index) => (
                    <div
                      key={cast.id}
                      className="animate-slide-in-up"
                      style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                    >
                      <CastCard cast={cast} showEngagement={false} />
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
