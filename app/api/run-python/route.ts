import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { writeFile, unlink } from 'fs/promises'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: NextRequest) {
  const { code } = await req.json()
  const fileName = `${uuidv4()}.py`

  try {
    await writeFile(fileName, code)

    return new Promise((resolve) => {
      exec(`python ${fileName}`, (error, stdout, stderr) => {
        unlink(fileName).catch(console.error) // Clean up the file

        if (error) {
          resolve(NextResponse.json({ error: stderr }, { status: 400 }))
        } else {
          resolve(NextResponse.json({ output: stdout }, { status: 200 }))
        }
      })
    })
  } catch (error) {
    console.error('Error executing Python code:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

