param(
  [Parameter(Mandatory = $true)][string]$InputPath,
  [Parameter(Mandatory = $true)][string]$OutputPath
)

Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing @'
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;

public static class CyanKey {
  public static void Remove(string input, string output) {
    using (var source = new Bitmap(input))
    using (var result = new Bitmap(source.Width, source.Height, PixelFormat.Format32bppArgb)) {
      using (var graphics = Graphics.FromImage(result)) graphics.DrawImageUnscaled(source, 0, 0);
      var rect = new Rectangle(0, 0, result.Width, result.Height);
      var data = result.LockBits(rect, ImageLockMode.ReadWrite, PixelFormat.Format32bppArgb);
      var bytes = Math.Abs(data.Stride) * data.Height;
      var pixels = new byte[bytes];
      Marshal.Copy(data.Scan0, pixels, 0, bytes);
      for (var y = 0; y < data.Height; y++) {
        for (var x = 0; x < data.Width; x++) {
          var i = y * data.Stride + x * 4;
          var b = pixels[i]; var g = pixels[i + 1]; var r = pixels[i + 2];
          var keyStrength = Math.Min(g, b) - r;
          if (g > 115 && b > 115 && keyStrength > 42) {
            pixels[i + 3] = 0;
          }
        }
      }
      Marshal.Copy(pixels, 0, data.Scan0, bytes);
      result.UnlockBits(data);
      result.Save(output, ImageFormat.Png);
    }
  }
}
'@

[CyanKey]::Remove((Resolve-Path -LiteralPath $InputPath), $ExecutionContext.SessionState.Path.GetUnresolvedProviderPathFromPSPath($OutputPath))
