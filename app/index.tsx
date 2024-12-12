import { TextInput, Button, Card } from 'react-native-paper';
import React from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity, ToastAndroid } from 'react-native';
import axios from 'axios';

export default function Index() {
  const [start, setStart] = React.useState("");
  const [destination, setDestination] = React.useState("");
  const [data, setData] = React.useState([]);
  const [time, setTime] = React.useState(''); // The time to display
  const [hours, setHours] = React.useState('00'); // State for hours
  const [minutes, setMinutes] = React.useState('00'); // State for minutes
  const [error, setError] = React.useState(''); // State for error message
  const baseurl = "https://busapi.amithv.xyz/api/v1/schedules?"

  const handleHourChange = (input: string) => {
    if (input.length <= 2 && !isNaN(Number(input))) {
      setHours(input);
    }
  };

  // Function to handle the minute change
  const handleMinuteChange = (input: string) => {
    if (input.length <= 2 && !isNaN(Number(input))) {
      setMinutes(input);
    }
  };

  // Function to confirm and set the time
  const handleConfirm = () => {
    if (Number(hours) >= 0 && Number(hours) <= 23 && Number(minutes) >= 0 && Number(minutes) <= 59) {
      const formattedTime = `${hours}:${minutes}`;
      setTime(formattedTime);
    }
    else {
      ToastAndroid.show('Invalid time format. Please enter a valid time (HH:MM)', ToastAndroid.LONG);
    }

  };

  const handleSubmit = async () => {
    const formattedStart = start.toLowerCase().trimEnd().split(' ').join('+'); 
    const formattedDestination = destination.toLowerCase().trimEnd().split(' ').join('+');
    const fullUrl = baseurl.concat(
      "departure=", formattedStart,
      "&destination=", formattedDestination,
      "&time=", time
    );
    console.log("API URL:", fullUrl);
    try {
      const response = await axios.get(fullUrl);
      console.log(response.data);
      const sorteddata = [...data].sort((a, b) => {
        const timeA = new Date(a.arrivalTime).getTime();
        const timeB = new Date(b.arrivalTime).getTime();
        return timeA - timeB; // Ascending order; for descending, swap the order (return timeB - timeA)
      });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <Card mode='contained'>
      <Card.Content>
        <Text style={styles.title}>Vehicle: {item.vehicle_number}</Text>
        <Text style={styles.subtitle}>Trip: {item.trip}</Text>
        {item.stations.map((station: any, index: number) => (
          <View key={index} style={styles.station}>
            <Text style={styles.stationName}>{station.station}</Text>
            <Text style={styles.time}>
              Arrival: {station.arrivalTime} | Departure: {station.departureTime}
            </Text>
          </View>
        ))}
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <TextInput
        label="Start"
        value={start}
        onChangeText={(start) => setStart(start)}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Destination"
        value={destination}
        onChangeText={(destination) => setDestination(destination)}
        mode="outlined"
        style={styles.input}
      />
      
      <View style={styles.timeInputContainer}>
        <View style={styles.timeinputs}>
        <TextInput
          style={styles.inputs}
          value={hours}
          onChangeText={handleHourChange}
          keyboardType="numeric"
          maxLength={2}
          placeholder="HH"
        />
        <Text style={styles.separator}>:</Text>
        <TextInput
          style={styles.inputs}
          value={minutes}
          onChangeText={handleMinuteChange}
          keyboardType="numeric"
          maxLength={2}
          placeholder="MM"
        />
        </View>
          <Button mode='contained' style={styles.okbutton} onPress={handleConfirm}>
            Ok
          </Button>
      </View>
          <Text style={styles.buttonText}>
            {time && `Selected Time: ${time}`}
          </Text>

      <Button
        icon="bus"
        mode="contained"
        onPress={handleSubmit}
        style={styles.button}
        contentStyle={styles.buttonContent}
      >
        Get Bus
      </Button>

      {data?.length > 0 && (
        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          style={styles.list}
          ItemSeparatorComponent={() => <View style={styles.listseparator} />} 
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderBlockColor: '#000',
  },
  input: {
    width: '100%',
    maxWidth: 400,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 16,
  },
  okbutton: {
    alignContent: 'center',
    justifyContent: 'center',
  },
  buttonContent: {
    paddingVertical: 2,
  },
  list: {
    marginVertical: 16,
    flex: 1,
    width: '100%',
    // marginHorizontal: 16,

  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 8,
    color: '#555',
  },
  station: {
    marginBottom: 4,
  },
  stationName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  time: {
    fontSize: 12,
    color: '#666',
  },
  buttonText: {
    color: '#666',
    fontSize: 16,
  },
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 16,
    justifyContent: 'center',
  },
  timeinputs: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputs: {
    width: 50,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    textAlign: 'left',
    fontSize: 18,
  },
  separator: {
    fontSize: 18,
    marginHorizontal: 8,
  },
  listseparator:{
    height: 16,
    width: "100%",
  }
});
