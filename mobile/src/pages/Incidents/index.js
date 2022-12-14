import React, { useEffect, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { View, FlatList, Image, Text, TouchableOpacity } from 'react-native';

import api from '../../services/api';

// importação automática do melhor formato de logo
import logoImg from '../../assets/logo.png';

import styles from './styles';

export default function Incidents() {
    const [incidents, setIncidents] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const navigation = useNavigation();

    function navigateToDetails(incident) {
        navigation.navigate('Details', { incident });
    }

    async function loadIncidents() {
        if (loading) { //evita que 2 requisições sejam feitas durante carregamento
            return;
        }

        if (total > 0 && incidents.lenght == total) {
            return;
        }

        setLoading(true);

        const response = await api.get('incidents', {
            params: { page }
        });

        setIncidents([ ...incidents, ...response.data]); // anexando os dois vetores
        setTotal(response.headers['x-total-count']);
        setPage(page + 1);
        setLoading(false);
    }

    useEffect(() => {
    loadIncidents();
    }, []);
    
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={logoImg} />
                <Text style={styles.headerText}>
                    Total de <Text style={styles.headerTextBold}>{total} casos</Text>.
                </Text>
            </View>

            <Text style={styles.title}>Bem-vindo!</Text>
            <Text style={styles.description}>Escolha um dos casos abaixo e salve o dia.</Text>

            <FlatList 
                data={incidents}
                style={styles.incidentList}
                keyExtractor={incident => String(incident.id)}
                showVerticalScrollIndicator={false}
                onEndReached={loadIncidents}
                renderItem={({ item: incident }) => (
                  <View style={styles.incident}>
                    <Text styles={styles.incidentProperty}>ONG:</Text>
                    <Text styles={styles.incidentValue}>{incident.name}</Text>

                    <Text styles={styles.incidentProperty}>CASO:</Text>
                    <Text styles={styles.incidentValue}>{incident.title}</Text>

                    <Text styles={styles.incidentProperty}>VALOR:</Text>
                    <Text styles={styles.incidentValue}>{Intl.NumberFormat('pt-BR', { 
                        style: 'currency', 
                        currency: 'BRL' 
                        }).format(incident.value)}
                    </Text>

                    <TouchableOpacity style={styles.detailsButton}
                     onPress={() => navigateToDetails(incident)}
                     >
                        <Text style={styles.detailsButtonText}>Ver mais detalhes</Text>
                        <Feather name="arrow-right" size={16} color="#E02041" />
                    </TouchableOpacity>
                  </View>
                )}
            />
        </View>
    );
}

