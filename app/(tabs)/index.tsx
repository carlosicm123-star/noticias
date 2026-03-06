import { Image as ExpoImage } from 'expo-image';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Linking, StyleSheet } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const API_KEY = '5496b2c0f15629bda61d27b1a315ca45';

export default function HomeScreen() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          `https://gnews.io/api/v4/top-headlines?country=br&lang=pt&max=10&apikey=${API_KEY}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Erro na API');
        }

        setArticles(data.articles || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <ExpoImage
          source={require('@/assets/images/noticias.jpg')}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Monitor de Notícias</ThemedText>
        <HelloWave />
      </ThemedView>

      {loading && <ActivityIndicator size="large" />}

      {error && <ThemedText style={styles.error}>Erro: {error}</ThemedText>}

      {!loading &&
        !error &&
        articles.map((article, index) => (
          <ThemedView key={index} style={styles.newsContainer}>
            {/* Miniatura da notícia */}
            {article.image && (
              <ExpoImage
                source={{ uri: article.image }}
                style={styles.thumbnail}
                contentFit="cover"
              />
            )}

            <ThemedText type="subtitle">{article.title}</ThemedText>

            <ThemedText numberOfLines={3}>{article.description}</ThemedText>

            <ThemedText
              style={styles.link}
              onPress={() => Linking.openURL(article.url)}
            >
              Ler notícia completa
            </ThemedText>
          </ThemedView>
        ))}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  newsContainer: {
    marginBottom: 20,
    padding: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  thumbnail: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
  },
  link: {
    marginTop: 8,
    color: '#1E90FF',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  reactLogo: {
    height: 250,
    width: '100%',
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});