import { insertPushUpInfo } from "@/db/models/pushup";
import { NextRequest, NextResponse } from "next/server";

// Definisikan tipe data untuk request body
type Data = {
  weight: number;
  pushUps: number;
};

export async function POST(request: NextRequest) {
  try {
    // Parsing JSON dengan type assertion ke tipe Data
    const data: Data = await request.json();
    console.log("Received data:", data);

    const { weight, pushUps } = data;

    // Validasi data input
    if (typeof weight !== "number" || typeof pushUps !== "number") {
      return NextResponse.json(
        {
          statusCode: 400,
          message: "Invalid input: 'weight' and 'pushUps' must be numbers.",
        },
        { status: 400 }
      );
    }

    // Fungsi untuk menghitung kalori per push-up
    function calculateCaloriesPerPushUp(weightInKg: number): number {
      const caloriesPerPushUp = (weightInKg * 0.29) / 100;
      return caloriesPerPushUp;
    }

    // Fungsi untuk menghitung total kalori yang terbakar
    function calculateTotalCalories(
      weightInKg: number,
      numberOfPushUps: number
    ): number {
      const caloriesPerPushUp = calculateCaloriesPerPushUp(weightInKg);
      const totalCalories = caloriesPerPushUp * numberOfPushUps;
      return totalCalories;
    }

    const caloriesPerPushUp = calculateCaloriesPerPushUp(weight);
    const totalCalories: number = calculateTotalCalories(weight, pushUps);

    const pushUp = await insertPushUpInfo(data, totalCalories);

    // Response sukses
    return NextResponse.json(
      {
        statusCode: 200,
        Kalori_yang_terbakar_per_push_up: caloriesPerPushUp.toFixed(3),
        Total_kalori_yang_terbakar: totalCalories.toFixed(1),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing request:", error);

    // Response error
    return NextResponse.json(
      {
        statusCode: 500,
        message: "An error occurred while processing your request.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
