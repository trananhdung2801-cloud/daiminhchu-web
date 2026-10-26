Add-Type -AssemblyName System.Runtime.WindowsRuntime
$null = [Windows.Storage.StorageFile, Windows.Storage, ContentType = WindowsRuntime]
$null = [Windows.Media.Ocr.OcrEngine, Windows.Foundation, ContentType = WindowsRuntime]
$null = [Windows.Graphics.Imaging.BitmapDecoder, Windows.Graphics.Imaging, ContentType = WindowsRuntime]

async function Get-OcrText($filePath) {
    $file = [Windows.Storage.StorageFile]::GetFileFromPathAsync($filePath).GetAwaiter().GetResult()
    $stream = $file.OpenAsync([Windows.Storage.FileAccessMode]::Read).GetAwaiter().GetResult()
    $decoder = [Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream).GetAwaiter().GetResult()
    $bitmap = $decoder.GetSoftwareBitmapAsync().GetAwaiter().GetResult()
    $engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromLanguage([Windows.Globalization.Language]::new("en-US"))
    if (-not $engine) {
        $engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromUserProfileLanguages()
    }
    $ocrResult = $engine.RecognizeAsync($bitmap).GetAwaiter().GetResult()
    return $ocrResult.Text
}

$dir = "C:\Users\trananh.dung\Downloads\Ảnh game ĐMC"
$files = Get-ChildItem -Path $dir | Sort-Object Name
$results = @()

foreach ($f in $files) {
    try {
        $text = (Get-OcrText $f.FullName).GetAwaiter().GetResult()
        $results += [PSCustomObject]@{
            FileName = $f.Name
            Size = $f.Length
            Text = $text
        }
        Write-Host "Processed $($f.Name)"
    } catch {
        Write-Host "Error processing $($f.Name): $_"
    }
}

$results | ConvertTo-Json -Depth 4 | Out-File -FilePath "C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\audit_all_37_images.json" -Encoding utf8
Write-Host "Saved all 37 images OCR to audit_all_37_images.json"
