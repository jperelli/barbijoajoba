import Head from 'next/head'
import dynamic from 'next/dynamic'

import Githubcorner from '../components/Githubcorner'
import styles from '../styles/Index.module.css'

const Map = dynamic(() => import('../components/Map'), { ssr: false })

export default function Index() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Barbijoajoba</title>
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content="Barbijo ajoba" />
        <meta property="og:description" content="App para marcar en un mapa los negocios donde te atienden con el barbijo ajoba de la nariz" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://barbijoajoba.vercel.app/og.png" />
        <meta property="og:image:width" content="550" />
        <meta property="og:image:height" content="254" />
      </Head>
      <Githubcorner />
      <Map />
    </div>
  )
}
