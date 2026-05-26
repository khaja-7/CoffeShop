$dir = Join-Path (Get-Location) ".maven"
if (-not (Test-Path $dir)) {
    New-Item -ItemType Directory -Path $dir | Out-Null
}
$zipPath = Join-Path $dir "maven.zip"
$extractedPath = Join-Path $dir "apache-maven-3.9.6"
if (-not (Test-Path $extractedPath)) {
    Write-Host "Downloading Apache Maven 3.9.6..."
    Invoke-WebRequest -Uri "https://archive.apache.org/dist/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.zip" -OutFile $zipPath
    Write-Host "Extracting Apache Maven..."
    Expand-Archive -Path $zipPath -DestinationPath $dir
    Remove-Item $zipPath
    Write-Host "Maven downloaded and extracted successfully."
} else {
    Write-Host "Maven already downloaded."
}
