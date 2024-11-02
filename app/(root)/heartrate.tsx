import { format } from "date-fns";
import {
  CameraView,
  CameraType,
  useCameraPermissions,
  Camera,
} from "expo-camera";
import {
  Canvas,
  useCanvasRef,
  Skia,
  SkImage,
  center,
} from "@shopify/react-native-skia";
import { useCallback, useState, useRef } from "react";
import {
  Button,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaFrame } from "react-native-safe-area-context";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { Stack } from "expo-router";
import { LineChart } from "react-native-chart-kit";
import { LineChartData } from "react-native-chart-kit/dist/line-chart/LineChart";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function Heartrate() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef();
  const canvasRef = useCanvasRef();
  const [countdownStart, setCountdownStart] = useState(false);
  const [timerkey, setTimerkey] = useState(0);
  const [heartArray, setHeartArray] = useState(new Array(10).fill(0));
  if (!permission) {
    // Camera permissions are still loading.
    return (
      <View>
        <Text>Loading Camera in progress...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }
  async function onStartRecord() {
    if (cameraRef.current) {
      let photo = await cameraRef.current.takePictureAsync(
        (options = {
          base64: true,
        }),
      );
      const base64 = Skia.Data.fromBase64(photo.base64);
      const image = Skia.Image.MakeImageFromEncoded(base64);
      console.log("base64", photo.base64);
      //   const pixels = image?.readPixels(0, 0, image.getImageInfo());
      //   console.log(pixels);
    }
  }
  function startCountdown() {
    setHeartArray(new Array(10).fill(0));
    setCountdownStart(true);
  }
  function CountDownUpdate(remainingTime: number) {
    var tmp = heartArray;
    tmp[remainingTime] = Math.random() * (90 - 70) + 70;
    setHeartArray(tmp);
  }
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{ headerTitle: `Heart Rate Monitor`, headerBackTitle: "Back" }}
      />
      <CountdownCircleTimer
        key={timerkey}
        isPlaying={countdownStart}
        duration={10}
        colors={"#A30000"}
        onComplete={() => {
          setCountdownStart(false);
          setTimerkey((prevKey) => prevKey + 1);
        }}
        onUpdate={(remainingTime) => CountDownUpdate(remainingTime)}
      >
        {({ remainingTime }) => (
          <>
            {!countdownStart && (
              <TouchableOpacity onPress={startCountdown}>
                <AntDesign name="caretright" size={80} color="#A30000" />
              </TouchableOpacity>
            )}
            {countdownStart && <Text>Remaining Time:{remainingTime}</Text>}
          </>
        )}
      </CountdownCircleTimer>
      <View style={{ marginTop: "20%" }}>
        <Text>Press your finger to the camera before touching start</Text>
        <Text>Start to enable camera preview</Text>
        {countdownStart && (
          <View style={styles.cameracontainer}>
            <CameraView
              ref={cameraRef}
              style={styles.camera}
              facing={facing}
              enableTorch
            ></CameraView>
          </View>
        )}
      </View>
      <LineChart
        data={{
          labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
          datasets: [
            {
              data: heartArray,
            },
          ],
        }}
        width={Dimensions.get("window").width} // from react-native
        height={220}
        chartConfig={{
          backgroundColor: "#e26a00",
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#ffa726",
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
  },
  cameracontainer: {
    display: "flex",
    flexDirection: "row",
    height: Dimensions.get("window").height * 0.3,
    width: Dimensions.get("window").width * 0.8,
    justifyContent: "center",
  },
  rowflex: {
    flex: 1,
    flexDirection: "row",
    marginLeft: "auto",
    marginRight: "auto",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
    width: 100,
    height: 180,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
