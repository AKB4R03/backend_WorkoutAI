import { getTotalCaloriesByUser } from "@/db/models/pushup";
import { NextRequest, NextResponse } from "next/server";
import { getUserWeightById } from "@/db/models/userInfo";
import { calculateCurrentWeight } from "../(action)/calculateWeight";

export async function GET(request: NextRequest) {
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

    const oldWeight: number = await getUserWeightById(userId);
    const totalCaloriesData = await getTotalCaloriesByUser(userId);

    console.log(totalCaloriesData, "================== dari model");

    // Assuming the current year; you can change this logic as needed
    const currentYear = new Date().getFullYear();

    // Mengelompokkan total kalori berdasarkan bulan
    const monthlyData = totalCaloriesData.map((item) => {
      const totalCalories = parseFloat(item.totalCalories); // Total kalori untuk bulan ini
      const currentWeight = calculateCurrentWeight(oldWeight, totalCalories); // Hitung berat badan saat ini
      return {
        currentWeight: currentWeight,
        totalCalories: totalCalories,
        month: item.month,
        year: currentYear, // Menyertakan tahun
      };
    });

    // Sort data by month (assuming all are from the same year)
    const sortedCaloriesData = monthlyData.sort((a, b) => {
      return b.month - a.month; // Sort by month descending
    });

    // Hitung total kalori dari semua bulan
    const totalCaloriesAllMonths = totalCaloriesData.reduce(
      (acc, item) => acc + parseFloat(item.totalCalories),
      0
    );

    // Hitung total kalori untuk 3 bulan terakhir
    const totalCaloriesLast3Months = sortedCaloriesData
      .slice(0, 3) // Ambil 3 bulan terakhir
      .reduce((acc, item) => acc + item.totalCalories, 0);

    // Hitung averageCurrentWeight
    const averageCurrentWeight = oldWeight - totalCaloriesAllMonths / 7700; // Mengurangi total kalori yang dibakar

    return NextResponse.json(
      {
        statusCode: 200,
        averageCurrentWeight: averageCurrentWeight.toFixed(2), // Berat badan setelah pengurangan
        caloriesBurnIn3Month: totalCaloriesLast3Months,
        data: monthlyData, // Mengembalikan data bulanan
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
