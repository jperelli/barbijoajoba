import MarkerClusterGroup from 'react-leaflet-markercluster'
import React, { CSSProperties, useEffect, useRef, useState } from 'react'
import { Icon, LatLng, LatLngTuple, LeafletMouseEvent, latLng } from 'leaflet'
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
import { SpinnerCircular } from 'spinners-react'

const icon = new Icon({
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  iconSize: [25, 41],
  iconAnchor: [13, 41],
  popupAnchor: [0, -30],
})

const spinnerStyle: CSSProperties = {
  position: 'absolute',
  top: '50%',
  right: '50%',
  zIndex: 10000,
  background: 'rgba(255,255,255,0.95)',
  padding: '10px',
  borderRadius: '10px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  border: '3px solid rgba(155,155,155,0.95)',
}
const spinnerSpanStyle: CSSProperties = {
  padding: '4px 0',
}
const spinningImgStyle: CSSProperties = {
  animation: 'rotation 4s infinite linear',
  borderRadius: '50%',
  backgroundImage: 'url(https://barbijoajoba.vercel.app/favicon.ico)',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  backgroundOrigin: 'content-box',
  backgroundPosition: '5px 12px',
}

interface Report {
  _id: string
  position: {
    // _id: string
    lat: number
    lon: number
  }
  name: string
  comment: string
}

const MapFC: React.FC = () => {
  const state = {
    lat: -34.603,
    lng: -58.381,
    zoom: 13,
  }
  const position: LatLngTuple = [state.lat, state.lng]

  const [markerlist, setMarkerList] = useState<Array<Report>>([])

  const getReports = async () => {
    setLoading(true)
    const res = await fetch('/api/reports')
    const newData = await res.json()
    setMarkerList(newData)
    setLoading(false)
  }

  const addReport = async (report: Partial<Report>) => {
    const rawResponse = await fetch('/api/saveReport', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: report.name,
        comment: report.comment,
        lat: report.position.lat,
        lon: report.position.lon,
      }),
    })
    const content = await rawResponse.json()
    setMarkerList(markerlist.concat(content))
  }

  useEffect(() => {
    getReports()
  }, [])

  const markerRef = useRef<Marker>()
  const [editingPosition, setEditingPosition] = useState<LatLng | undefined>()
  const [formName, setFormName] = useState<string>('')
  const [formComment, setFormComment] = useState<string>('')
  const [saving, setSaving] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const handleClick = (e: LeafletMouseEvent) => {
    setEditingPosition(e.latlng)
    markerRef.current.leafletElement.fire('click')
  }

  const handlePopupClose = () => {
    setFormComment('')
    setFormName('')
  }

  const handleFormNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormName(e.target.value)
  }

  const handleFormCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormComment(e.target.value)
  }

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    try {
      await addReport({
        comment: formComment,
        name: formName,
        position: { lat: editingPosition.lat, lon: editingPosition.lng },
      })
    } catch (e) {
      setSaving(false)
    }
    setEditingPosition(undefined)
    setSaving(false)
  }

  return (
    <>
      {loading ? (
        <div style={spinnerStyle}>
          <SpinnerCircular style={spinningImgStyle} thickness={200} color="#444" secondaryColor="#FFF" />
          <span style={spinnerSpanStyle}>Cargando</span>
          <span style={spinnerSpanStyle}>barbijoabajeros</span>
        </div>
      ) : null}
      <Map
        style={{ height: '100%', width: '100%' }}
        center={position}
        zoom={state.zoom}
        onclick={handleClick}
        maxZoom={19}
      >
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MarkerClusterGroup>
          {markerlist.map((m) => (
            <Marker key={m._id} icon={icon} position={latLng({ lat: m.position.lat, lng: m.position.lon })}>
              <Popup>
                <h3>{m.name}</h3>
                <p>{m.comment}</p>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
        {!editingPosition ? null : (
          <Marker icon={icon} position={editingPosition} ref={markerRef}>
            <Popup onClose={handlePopupClose}>
              <h3>Reporte de barbijo ajoba</h3>
              <form onSubmit={handleFormSubmit}>
                <label htmlFor="name">Nombre del lugar</label>
                <br />
                <input
                  disabled={saving}
                  autoFocus
                  required
                  id="name"
                  placeholder="Ferreteria 'lo de cacho'"
                  onChange={handleFormNameChange}
                  value={formName}
                />
                <br />
                <br />
                <label htmlFor="comment">Comentario</label>
                <br />
                <textarea
                  disabled={saving}
                  required
                  rows={4}
                  id="comment"
                  placeholder="Me atendio con el barbijo de codera"
                  onChange={handleFormCommentChange}
                  value={formComment}
                ></textarea>
                <br />
                <br />
                <button disabled={saving} type="submit">
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
              </form>
              {saving ? (
                <SpinnerCircular style={spinningImgStyle} thickness={200} color="#444" secondaryColor="#FFF" />
              ) : null}
            </Popup>
          </Marker>
        )}
      </Map>
    </>
  )
}

export default MapFC
