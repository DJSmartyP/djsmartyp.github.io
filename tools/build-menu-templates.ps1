$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$projectRoot = Split-Path -Parent $PSScriptRoot
$assets = Join-Path $projectRoot 'assets'
$logoSource = [System.Drawing.Bitmap]::new((Join-Path $assets 'jag-logo.png'))
$whiteLogo = [System.Drawing.Bitmap]::new($logoSource.Width, $logoSource.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
for ($y = 0; $y -lt $logoSource.Height; $y++) {
    for ($x = 0; $x -lt $logoSource.Width; $x++) {
        $alpha = $logoSource.GetPixel($x, $y).A
        $whiteLogo.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, 255, 255, 255))
    }
}
$whiteLogo.Save((Join-Path $assets 'jag-logo-white.png'), [System.Drawing.Imaging.ImageFormat]::Png)
$logoSource.Dispose()

$purple = [System.Drawing.ColorTranslator]::FromHtml('#491775')
$deep = [System.Drawing.ColorTranslator]::FromHtml('#321048')
$lightPurple = [System.Drawing.ColorTranslator]::FromHtml('#64258c')
$yellow = [System.Drawing.ColorTranslator]::FromHtml('#ffcf00')
$ink = [System.Drawing.ColorTranslator]::FromHtml('#321048')
$white = [System.Drawing.Color]::White
$fills = @('#ffffff', '#ffdbdf', '#ccebd2', '#ffda48', '#ffffff')
$days = @('MON', 'TUE', 'WED', 'THU', 'FRI')
$family = [System.Drawing.FontFamily]::new('Arial')
$titleFont = [System.Drawing.Font]::new($family, 69, [System.Drawing.FontStyle]::Bold -bor [System.Drawing.FontStyle]::Italic, [System.Drawing.GraphicsUnit]::Pixel)
$titleSmallFont = [System.Drawing.Font]::new($family, 57, [System.Drawing.FontStyle]::Bold -bor [System.Drawing.FontStyle]::Italic, [System.Drawing.GraphicsUnit]::Pixel)
$labelFont = [System.Drawing.Font]::new($family, 22, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$sectionFont = [System.Drawing.Font]::new($family, 31, [System.Drawing.FontStyle]::Bold -bor [System.Drawing.FontStyle]::Italic, [System.Drawing.GraphicsUnit]::Pixel)
$dayFont = [System.Drawing.Font]::new($family, 24, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$footerFont = [System.Drawing.Font]::new($family, 28, [System.Drawing.FontStyle]::Bold -bor [System.Drawing.FontStyle]::Italic, [System.Drawing.GraphicsUnit]::Pixel)
$smallFont = [System.Drawing.Font]::new($family, 17, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
$center = [System.Drawing.StringFormat]::new()
$center.Alignment = [System.Drawing.StringAlignment]::Center
$center.LineAlignment = [System.Drawing.StringAlignment]::Center

foreach ($session in @('breakfast', 'after-school')) {
    $isBreakfast = $session -eq 'breakfast'
    $artName = if ($isBreakfast) { 'breakfast-art.png' } else { 'after-school-art.png' }
    $title = if ($isBreakfast) { 'Breakfast Club' } else { 'After-School Club' }
    $section = if ($isBreakfast) { 'THIS WEEK AT BREAKFAST' } else { 'THIS WEEK AFTER SCHOOL' }
    $bitmap = [System.Drawing.Bitmap]::new(1191, 1684, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    $purpleBrush = [System.Drawing.SolidBrush]::new($purple)
    $deepBrush = [System.Drawing.SolidBrush]::new($deep)
    $lightBrush = [System.Drawing.SolidBrush]::new($lightPurple)
    $yellowBrush = [System.Drawing.SolidBrush]::new($yellow)
    $whiteBrush = [System.Drawing.SolidBrush]::new($white)
    $graphics.FillRectangle($purpleBrush, 0, 0, 1191, 1684)
    $graphics.FillRectangle($deepBrush, 0, 0, 1191, 321)
    $graphics.FillEllipse($lightBrush, 1030, -110, 350, 350)
    $graphics.FillEllipse($lightBrush, -130, 1510, 300, 300)
    $graphics.DrawImage($whiteLogo, [System.Drawing.Rectangle]::new(73, 46, 140, 157))
    $graphics.DrawString('JUNIOR ADVENTURES GROUP', $labelFont, $yellowBrush, [System.Drawing.PointF]::new(273, 46))
    $graphics.DrawString($title, $(if ($isBreakfast) { $titleFont } else { $titleSmallFont }), $whiteBrush, [System.Drawing.PointF]::new(265, 90))
    $graphics.FillRectangle($yellowBrush, 270, 190, 850, 11)
    $graphics.DrawString('CLUB / SCHOOL', $labelFont, $yellowBrush, [System.Drawing.PointF]::new(76, 242))
    $graphics.DrawString('WEEK COMMENCING', $labelFont, $yellowBrush, [System.Drawing.PointF]::new(710, 242))
    $graphics.FillRectangle($lightBrush, 74, 345, 1042, 407)
    $art = [System.Drawing.Image]::FromFile((Join-Path $assets $artName))
    $graphics.DrawImage($art, [System.Drawing.Rectangle]::new(250, 300, 690, 460))
    $art.Dispose()
    $graphics.DrawString($section, $sectionFont, $yellowBrush, [System.Drawing.PointF]::new(82, 776))
    $graphics.FillRectangle($yellowBrush, 82, 824, 1025, 7)
    for ($i = 0; $i -lt 5; $i++) {
        $top = 848 + ($i * 140)
        $fill = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml($fills[$i]))
        $graphics.FillRectangle($fill, 79, $top, 1032, 127)
        $graphics.FillRectangle($yellowBrush, 79, $top, 12, 127)
        $graphics.FillEllipse($deepBrush, 112, $top + 26, 76, 76)
        $graphics.DrawString($days[$i], $dayFont, $whiteBrush, [System.Drawing.RectangleF]::new(112, $top + 26, 76, 76), $center)
        $fill.Dispose()
    }
    $graphics.DrawString('GOOD FOOD. HAPPY ADVENTURES.', $footerFont, $yellowBrush, [System.Drawing.PointF]::new(79, 1558))
    $graphics.DrawString('Ask the club team about ingredients and dietary needs. Menus may change with availability. Water is available.', $smallFont, $whiteBrush, [System.Drawing.PointF]::new(79, 1611))
    $bitmap.Save((Join-Path $assets "menu-template-$session.png"), [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $bitmap.Dispose()
    $purpleBrush.Dispose()
    $deepBrush.Dispose()
    $lightBrush.Dispose()
    $yellowBrush.Dispose()
    $whiteBrush.Dispose()
}

$whiteLogo.Dispose()
foreach ($font in @($titleFont, $titleSmallFont, $labelFont, $sectionFont, $dayFont, $footerFont, $smallFont)) { $font.Dispose() }
$center.Dispose()
$family.Dispose()
