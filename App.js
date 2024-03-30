import { Accelerometer } from "expo-sensors";
import { StatusBar } from "expo-status-bar";
import LottieView from "lottie-react-native";
import { useEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const CALORIES_PER_STEP = 0.05;

export default function App() {
  const [steps, setSteps] = useState(0);
  const [isCounting, setIsCounting] = useState(false);
  const [lastY, setLastY] = useState(0);
  const [lastTimeStamp, setLastTimeStamp] = useState(0);

  const animationRefRunning = useRef(null);
  const animationRefSitting = useRef(null);

  useEffect(() => {
    let subscription;
    Accelerometer.isAvailableAsync().then((result) => {
      if (result) {
        subscription = Accelerometer.addListener((accelerometerData) => {
          const { y } = accelerometerData;
          const threshold = 0.1;
          const timeStamp = new Date().getTime();
          if (
            Math.abs(y - lastY) > threshold &&
            !isCounting &&
            timeStamp - lastTimeStamp > 800
          ) {
            setIsCounting(true);
            setLastY(y);
            setLastTimeStamp(timeStamp);
            setSteps((prevSteps) => prevSteps + 1);
            setTimeout(() => {
              setIsCounting(false);
            }, 1000);
          }
        });
      } else {
        console.log("Accelerometer not available on this device");
      }
    });
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [isCounting, lastY, lastTimeStamp]);

  const resetSteps = () => {
    setSteps(0);
  };

  const estimatedCaloriesBurnt = steps * CALORIES_PER_STEP;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Steps Tracker</Text>
      <View style={styles.infoContainer}>
        <View style={styles.stepsContainer}>
          <Text style={styles.stepsText}>{steps}</Text>
          <Text style={styles.stepsLabel}>Steps</Text>
        </View>
        <View style={styles.caloriesContainer}>
          <Text style={styles.caloriesLabel}>Estimated Calories Burnt: </Text>
          <Text style={styles.caloriesText}>
            {estimatedCaloriesBurnt.toFixed(2)} calories
          </Text>
        </View>
      </View>
      <View style={styles.animationContainer}>
        {steps !== 0 ? (
          <LottieView
            autoPlay
            ref={animationRefRunning}
            style={styles.animation}
            source={require("./assets/running.json")}
          />
        ) : (
          <LottieView
            autoPlay
            ref={animationRefSitting}
            style={styles.animation}
            source={require("./assets/sitting.json")}
          />
        )}
      </View>
      <TouchableOpacity style={styles.button} onPress={resetSteps}>
        <Text style={styles.buttonText}>Reset</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    marginTop: 26,
    color: "#6666ff",
    fontWeight: "bold",
  },
  infoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  stepsContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,
  },
  stepsText: {
    fontSize: 40,
    fontWeight: "bold",
    marginRight: 12,
    color: "#137821",
  },
  stepsLabel: {
    fontSize: 16,
    color: "#137821",
  },
  caloriesContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  caloriesLabel: {
    fontSize: 14,
    marginRight: 6,
    color: "#0d376e",
  },
  caloriesText: {
    fontSize: 14,
    color: "#750d9e",
    fontWeight: "bold",
  },
  animationContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    marginBottom: 16,
  },
  animation: {
    width: 400,
    height: 400,
    backgroundColor: "transparent",
  },
  button: {
    backgroundColor: "#6666ff",
    padding: 12,
    width: "70%",
    marginTop: 12,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 12,
    color: "#ffffff",
    textAlign: "center",
  },
});
