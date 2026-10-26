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
$folder = 'C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\assets\ingame_samples'
$files = Get-ChildItem -Path $folder -Filter '*.jpg' | Sort-Object Name

foreach ($f in $files) {
    try {
        $fileTask = [Windows.Storage.StorageFile]::GetFileFromPathAsync($f.FullName)
        $storageFile = AwaitTask $fileTask ([Windows.Storage.StorageFile])
        $streamTask = $storageFile.OpenAsync([Windows.Storage.FileAccessMode]::Read)
        $stream = AwaitTask $streamTask ([Windows.Storage.Streams.IRandomAccessStream])
        $decoderTask = [Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream)
        $decoder = AwaitTask $decoderTask ([Windows.Graphics.Imaging.BitmapDecoder])
        $bitmapTask = $decoder.GetSoftwareBitmapAsync()
        $bitmap = AwaitTask $bitmapTask ([Windows.Graphics.Imaging.SoftwareBitmap])
        $ocrTask = $engine.RecognizeAsync($bitmap)
        $result = AwaitTask $ocrTask ([Windows.Media.Ocr.OcrResult])
        $lines = ($result.Lines | ForEach-Object { $_.Text }) -join ' | '
        Write-Output ('[' + $f.Name + '] ' + $lines)
    } catch {
        Write-Output ('[' + $f.Name + '] Error: ' + $_.Exception.Message)
    }
}
