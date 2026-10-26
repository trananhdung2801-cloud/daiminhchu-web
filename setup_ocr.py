import os
import subprocess
from PIL import Image

orig_folder = r"C:\Users\trananh.dung\Downloads\Ảnh game ĐMC"
files = sorted(os.listdir(orig_folder))

# We can run OCR via powershell on specific crops or whole files
script_content = '''
Add-Type -AssemblyName System.Runtime.WindowsRuntime
$asTaskGeneric = ([System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1' })[0]
Function AwaitTask($WinRtTask, $ResultType) {
    $asTask = $asTaskGeneric.MakeGenericMethod($ResultType)
    $netTask = $asTask.Invoke($null, @($WinRtTask))
    $netTask.Wait(-1) | Out-Null
    $netTask.Result
}
[Windows.Storage.StorageFile, Windows.Storage, ContentType = WindowsRuntime] | Out-Null
[Windows.Graphics.Imaging.BitmapDecoder, Windows.Graphics.Imaging, ContentType = WindowsRuntime] | Out-Null
[Windows.Media.Ocr.OcrEngine, Windows.Media.Ocr, ContentType = WindowsRuntime] | Out-Null

$engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromUserProfileLanguages()
$fileTask = [Windows.Storage.StorageFile]::GetFileFromPathAsync($args[0])
$storageFile = AwaitTask $fileTask ([Windows.Storage.StorageFile])
$streamTask = $storageFile.OpenAsync([Windows.Storage.FileAccessMode]::Read)
$stream = AwaitTask $streamTask ([Windows.Storage.Streams.IRandomAccessStream])
$decoderTask = [Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream)
$decoder = AwaitTask $decoderTask ([Windows.Graphics.Imaging.BitmapDecoder])
$bitmapTask = $decoder.GetSoftwareBitmapAsync()
$bitmap = AwaitTask $bitmapTask ([Windows.Graphics.Imaging.SoftwareBitmap])
$ocrTask = $engine.RecognizeAsync($bitmap)
$result = AwaitTask $ocrTask ([Windows.Media.Ocr.OcrResult])
foreach ($line in $result.Lines) {
    Write-Output $line.Text
}
'''
with open("do_ocr.ps1", "w", encoding="utf-8") as f:
    f.write(script_content)

print("Generated do_ocr.ps1")
