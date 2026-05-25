import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/cv/[id] - Fetch a specific CV
export async function GET(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    const cv = await prisma.cV.findUnique({
      where: { id },
    });

    if (!cv) {
      return NextResponse.json({ error: "CV introuvable." }, { status: 404 });
    }

    return NextResponse.json({
      ...cv,
      colors: JSON.parse(cv.colors),
      typography: JSON.parse(cv.typography),
      layout: JSON.parse(cv.layout),
      personalInfo: JSON.parse(cv.personalInfo),
      sections: JSON.parse(cv.sections),
    });
  } catch (error: any) {
    console.error("GET /api/cv/[id] error:", error);
    return NextResponse.json(
      { error: "Impossible de récupérer le CV.", details: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/cv/[id] - Update a specific CV
export async function PUT(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { title, template, colors, typography, layout, personalInfo, sections } = body;

    const cv = await prisma.cV.update({
      where: { id },
      data: {
        title: title || undefined,
        template: template || undefined,
        colors: colors ? JSON.stringify(colors) : undefined,
        typography: typography ? JSON.stringify(typography) : undefined,
        layout: layout ? JSON.stringify(layout) : undefined,
        personalInfo: personalInfo ? JSON.stringify(personalInfo) : undefined,
        sections: sections ? JSON.stringify(sections) : undefined,
      },
    });

    return NextResponse.json({
      ...cv,
      colors: JSON.parse(cv.colors),
      typography: JSON.parse(cv.typography),
      layout: JSON.parse(cv.layout),
      personalInfo: JSON.parse(cv.personalInfo),
      sections: JSON.parse(cv.sections),
    });
  } catch (error: any) {
    console.error("PUT /api/cv/[id] error:", error);
    return NextResponse.json(
      { error: "Impossible de modifier le CV.", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/cv/[id] - Delete a specific CV
export async function DELETE(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    await prisma.cV.delete({
      where: { id },
    });

    return NextResponse.json({ message: "CV supprimé avec succès." });
  } catch (error: any) {
    console.error("DELETE /api/cv/[id] error:", error);
    return NextResponse.json(
      { error: "Impossible de supprimer le CV.", details: error.message },
      { status: 500 }
    );
  }
}
