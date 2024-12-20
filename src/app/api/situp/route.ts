import { insertPushUpInfo } from "@/db/models/pushup";
import { getUserWeightById } from "@/db/models/userInfo";
import { NextRequest, NextResponse } from "next/server";

// Definisikan tipe data untuk request body
type Data = {
  weight: number;
  sitUps: number;
};

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");

    if (!userId || userId.length !== 24) {
      return NextResponse.json(
        {
          statusCode: 400,
          message: "Invalid or missing user ID.",
        },
        { status: 400 }
      );
    }
    const weight = await getUserWeightById(userId);

    // Parsing JSON dengan type assertion ke tipe Data
    const data: Data = await request.json();
    console.log("Received data:", data);

    const { sitUps } = data;

    // Validasi data input
    if (typeof weight !== "number" || typeof sitUps !== "number") {
      return NextResponse.json(
        {
          statusCode: 400,
          message: "Invalid input: 'weight' and 'sitUps' must be numbers.",
        },
        { status: 400 }
      );
    }

    // Fungsi untuk menghitung kalori per push-up
    function calculateCaloriesPerPushUp(weightInKg: number): number {
      const caloriesPerPushUp = (weightInKg * 0.3) / 100;
      return caloriesPerPushUp;
    }

    // Fungsi untuk menghitung total kalori yang terbakar
    function calculateTotalCalories(
      weightInKg: number,
      numberOfsitups: number
    ): number {
      const caloriesPerPushUp = calculateCaloriesPerPushUp(weightInKg);
      const totalCalories = caloriesPerPushUp * numberOfsitups;
      return totalCalories;
    }

    const caloriesPerPushUp = calculateCaloriesPerPushUp(weight);
    const totalCalories: number = calculateTotalCalories(weight, sitUps);

    await insertPushUpInfo(data, totalCalories, userId);

    // Response sukses
    return NextResponse.json(
      {
        statusCode: 200,
        Kalori_yang_terbakar_per_sit_up: caloriesPerPushUp.toFixed(2),
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
