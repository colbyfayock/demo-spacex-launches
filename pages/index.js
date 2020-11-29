import Head from 'next/head'

import { ApolloClient, InMemoryCache, gql } from '@apollo/client';


import styles from '../styles/Home.module.css'

export default function Home({ launches }) {
  console.log('launches', launches);
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          SpaceX Launches
        </h1>

        <p className={styles.description}>
          <a href="https://www.spacex.com/launches/">Latest launches</a> from SpaceX
        </p>

        <ul className={`${styles.grid} ${styles.launches}`}>
          {launches.map(launch => {
            const style = {};

            if ( launch.links.mission_patch ) {
              style.backgroundImage = `url(${launch.links.mission_patch})`;
            }

            return (
              <li key={launch.id} className={styles.card}>
                <a href={launch.links.video_link}>
                  <span className={styles.launchImage} style={style} />
                  <h3>{ launch.mission_name }</h3>
                  <ul>
                    <li>
                      <strong>Rocket:</strong> {launch.rocket.rocket_name}
                    </li>
                    <li>
                      <strong>Launch Date:</strong> { new Date(launch.launch_date_local).toLocaleDateString("en-US") }
                    </li>
                    <li>
                      <strong>Location:</strong> {launch.launch_site.site_name_long}
                    </li>
                  </ul>
                </a>
              </li>
            )
          })}
        </ul>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  )
}

export async function getStaticProps() {
  const client = new ApolloClient({
    uri: 'https://api.spacex.land/graphql/',
    cache: new InMemoryCache()
  });

  const { data } = await client.query({
    query: gql`
      query GetLaunches {
        launchesPast(limit: 10) {
          id
          mission_name
          launch_date_local
          launch_site {
            site_name_long
          }
          links {
            article_link
            video_link
            mission_patch
          }
          rocket {
            rocket_name
          }
        }
      }

    `
  });

  return {
    props: {
      launches: data.launchesPast
    }
  }
}