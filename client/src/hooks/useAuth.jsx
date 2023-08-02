
import { useState, useEffect } from "react"
import axios from "axios"

export default function useAuth(code) {
  const [accessToken, setAccessToken] = useState()
  const [refreshToken, setRefreshToken] = useState()
  const [expiresIn, setExpiresIn] = useState()

  useEffect(() => {
    axios
      .post("http://localhost:8000/api/login", {
        code,
      })
      .then(res => {
        setAccessToken(res.data.accessToken)
        setRefreshToken(res.data.refreshToken)
        setExpiresIn(res.data.expiresIn)

        window.history.pushState({}, null, "/")
      })
      .catch(() => {
       
      })
  }, [code])

  useEffect(() => {
    if (!refreshToken || !expiresIn) return
    const timeout = setTimeout(() => {
      axios
        .post("http://localhost:8000/api/refresh", {
          refreshToken,
        })
        .then(res => {
          setAccessToken(res.data.accessToken)
          setExpiresIn(res.data.expiresIn)
        
        })
        .catch(() => {
          window.location = "/"
        })
    }, (expiresIn -  60) * 1000)

    return () => clearTimeout(timeout)
  }, [refreshToken, expiresIn])

  return accessToken
}