import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Satellite, MapPin, Clock, Eye, EyeOff, Loader2, Search } from 'lucide-react'
import './App.css'

function App() {
  const [satellites, setSatellites] = useState([])
  const [selectedSatellite, setSelectedSatellite] = useState(null)
  const [position, setPosition] = useState(null)
  const [passes, setPasses] = useState([])
  const [loading, setLoading] = useState(false)
  const [observer, setObserver] = useState({
    latitude: 48.8566,
    longitude: 2.3522,
    elevation: 35
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [isTracking, setIsTracking] = useState(false)

  const API_BASE = 'http://localhost:5000/api'

  // Charger la liste des satellites
  useEffect(() => {
    fetchSatellites()
  }, [])

  // Suivi en temps réel
  useEffect(() => {
    let interval
    if (isTracking && selectedSatellite && selectedSatellite.norad_id === 25544) { // Seulement pour l'ISS
      interval = setInterval(() => {
        fetchIssPosition()
      }, 10000) // Mise à jour toutes les 10 secondes
    }
    return () => clearInterval(interval)
  }, [isTracking, selectedSatellite])

  const fetchSatellites = async () => {
    try {
      const response = await fetch(`${API_BASE}/satellites`)
      const data = await response.json()
      if (data.success) {
        setSatellites(data.satellites)
        if (data.satellites.length > 0) {
          setSelectedSatellite(data.satellites[0]) // Sélectionne l'ISS par défaut
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des satellites:', error)
    }
  }

  const fetchIssPosition = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE}/iss/position`)
      const data = await response.json()
      if (data.success) {
        setPosition(data.position)
      }
    } catch (error) {
      console.error('Erreur lors du calcul de position de l\'ISS:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSatelliteSelect = (satellite) => {
    setSelectedSatellite(satellite)
    setPosition(null)
    setPasses([])
    setIsTracking(false) // Arrêter le suivi si on change de satellite
  }

  const handleStartTracking = () => {
    if (selectedSatellite && selectedSatellite.norad_id === 25544) {
      setIsTracking(true)
      fetchIssPosition()
    } else {
      alert('Le suivi en temps réel est actuellement disponible uniquement pour l\'ISS.')
    }
  }

  const handleStopTracking = () => {
    setIsTracking(false)
  }

  const filteredSatellites = satellites.filter(sat =>
    sat.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleString('fr-FR')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Satellite className="h-8 w-8 text-blue-400" />
            <h1 className="text-4xl font-bold text-white">Satellite Tracker</h1>
          </div>
          <p className="text-slate-300 text-lg">Suivi des satellites en temps réel</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panel de configuration */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Position de l'observateur (désactivé pour l'ISS) */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Latitude (Observateur)</Label>
                  <Input
                    type="number"
                    step="0.0001"
                    value={observer.latitude}
                    onChange={(e) => setObserver({...observer, latitude: parseFloat(e.target.value)})}
                    className="bg-slate-700 border-slate-600 text-white"
                    disabled // Désactivé pour l'ISS
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Longitude (Observateur)</Label>
                  <Input
                    type="number"
                    step="0.0001"
                    value={observer.longitude}
                    onChange={(e) => setObserver({...observer, longitude: parseFloat(e.target.value)})}
                    className="bg-slate-700 border-slate-600 text-white"
                    disabled // Désactivé pour l'ISS
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Altitude (m) (Observateur)</Label>
                  <Input
                    type="number"
                    value={observer.elevation}
                    onChange={(e) => setObserver({...observer, elevation: parseInt(e.target.value)})}
                    className="bg-slate-700 border-slate-600 text-white"
                    disabled // Désactivé pour l'ISS
                  />
                </div>

                {/* Recherche de satellites */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Rechercher un satellite</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Nom du satellite..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-slate-700 border-slate-600 text-white"
                      disabled // Désactivé pour l'ISS
                    />
                  </div>
                </div>

                {/* Liste des satellites */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Satellites disponibles</Label>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {filteredSatellites.map((satellite) => (
                      <Button
                        key={satellite.id}
                        variant={selectedSatellite?.id === satellite.id ? "default" : "outline"}
                        className="w-full justify-start text-left h-auto p-2"
                        onClick={() => handleSatelliteSelect(satellite)}
                        disabled={satellite.norad_id !== 25544} // Seule l'ISS est sélectionnable
                      >
                        <div>
                          <div className="font-medium">{satellite.name}</div>
                          <div className="text-xs opacity-70">NORAD: {satellite.norad_id}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Panel principal */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">
                    {selectedSatellite ? selectedSatellite.name : 'Aucun satellite sélectionné'}
                  </CardTitle>
                  <div className="flex gap-2">
                    {!isTracking ? (
                      <Button 
                        onClick={handleStartTracking}
                        disabled={!selectedSatellite || loading || selectedSatellite.norad_id !== 25544}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {loading ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Eye className="h-4 w-4 mr-2" />
                        )}
                        Démarrer le suivi
                      </Button>
                    ) : (
                      <Button 
                        onClick={handleStopTracking}
                        variant="destructive"
                      >
                        <EyeOff className="h-4 w-4 mr-2" />
                        Arrêter le suivi
                      </Button>
                    )}
                  </div>
                </div>
                {selectedSatellite && (
                  <CardDescription className="text-slate-400">
                    NORAD ID: {selectedSatellite.norad_id} • Catégorie: {selectedSatellite.category}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="position" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-slate-700">
                    <TabsTrigger value="position" className="text-white">Position actuelle</TabsTrigger>
                    <TabsTrigger value="passes" className="text-white" disabled>Prochains passages (non dispo)</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="position" className="mt-4">
                    {position ? (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card className="bg-slate-700/50">
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-blue-400">{position.latitude}°</div>
                            <div className="text-sm text-slate-300">Latitude</div>
                          </CardContent>
                        </Card>
                        <Card className="bg-slate-700/50">
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-green-400">{position.longitude}°</div>
                            <div className="text-sm text-slate-300">Longitude</div>
                          </CardContent>
                        </Card>
                        <Card className="bg-slate-700/50">
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-purple-400">{position.range_km || 'N/A'}</div>
                            <div className="text-sm text-slate-300">Distance (km)</div>
                          </CardContent>
                        </Card>
                        <Card className="bg-slate-700/50">
                          <CardContent className="p-4 text-center">
                            <Badge variant={position.visible ? "default" : "secondary"} className="text-sm">
                              {position.visible ? "Visible" : "Non visible"}
                            </Badge>
                            <div className="text-sm text-slate-300 mt-1">Statut</div>
                          </CardContent>
                        </Card>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Satellite className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                        <p className="text-slate-400">
                          {selectedSatellite 
                            ? "Cliquez sur 'Démarrer le suivi' pour voir la position de l'ISS" 
                            : "Sélectionnez l'ISS pour commencer"
                          }
                        </p>
                      </div>
                    )}
                    
                    {position && (
                      <div className="mt-4 p-4 bg-slate-700/30 rounded-lg">
                        <div className="flex items-center gap-2 text-slate-300">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm">
                            Dernière mise à jour: {formatDateTime(position.timestamp)}
                          </span>
                        </div>
                        {isTracking && (
                          <div className="text-xs text-green-400 mt-1">
                            • Suivi en temps réel actif (mise à jour toutes les 10s)
                          </div>
                        )}
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="passes" className="mt-4">
                    <div className="text-center py-8">
                      <Clock className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                      <p className="text-slate-400">
                        Les passages ne sont pas disponibles pour l'ISS avec cette API temporaire.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

