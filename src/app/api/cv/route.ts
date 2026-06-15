import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

// GET /api/cv - Fetch all saved CVs
export async function GET() {
  try {
    const cvs = await prisma.cV.findMany({
      orderBy: { updatedAt: "desc" },
    });

    // Parse stringified fields back to JSON for the response
    const parsedCvs = cvs.map((cv) => ({
      ...cv,
      colors: JSON.parse(cv.colors),
      typography: JSON.parse(cv.typography),
      layout: JSON.parse(cv.layout),
      personalInfo: JSON.parse(cv.personalInfo),
      socialLinks: JSON.parse(cv.socialLinks),
      sections: JSON.parse(cv.sections),
    }));

    return NextResponse.json(parsedCvs);
  } catch (error: any) {
    console.error("GET /api/cv error:", error);
    return NextResponse.json(
      { error: "Impossible de récupérer les CVs.", details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/cv - Create a new CV
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, template, colors, typography, layout, personalInfo, socialLinks, sections } = body;

    const cv = await prisma.cV.create({
      data: {
        title: title || "Mon CV",
        template: template || "primary",
        colors: colors ? JSON.stringify(colors) : undefined,
        typography: typography ? JSON.stringify(typography) : undefined,
        layout: layout ? JSON.stringify(layout) : undefined,
        personalInfo: personalInfo ? JSON.stringify(personalInfo) : undefined,
        socialLinks: socialLinks ? JSON.stringify(socialLinks) : "[]",
        sections: sections ? JSON.stringify(sections) : undefined,
      },
    });

    return NextResponse.json({
      ...cv,
      colors: JSON.parse(cv.colors),
      typography: JSON.parse(cv.typography),
      layout: JSON.parse(cv.layout),
      personalInfo: JSON.parse(cv.personalInfo),
      socialLinks: JSON.parse(cv.socialLinks),
      sections: JSON.parse(cv.sections),
    });
  } catch (error: any) {
    console.error("POST /api/cv error:", error);
    return NextResponse.json(
      { error: "Impossible de créer le CV.", details: error.message },
      { status: 500 }
    );
  }
}
