<template>
  <view class="radar-chart">
    <canvas id="radarCanvas" type="2d" class="radar-chart__canvas" :style="{ width: size + 'px', height: size + 'px' }" disable-scroll />
  </view>
</template>

<script setup lang="ts">
import { watch, onMounted, getCurrentInstance } from 'vue'

interface Dimension {
  name: string
  score: number
}

const props = defineProps<{
  dimensions: Dimension[]
  size: number
}>()

function drawRadar() {
  const instance = getCurrentInstance()
  if (!instance) return

  uni
    .createSelectorQuery()
    .in(instance!)
    .select('#radarCanvas')
    // @ts-ignore - 小程序 Canvas 2D 使用 fields+exec 回调获取 node
    .fields({ node: true, size: true } as any)
    .exec((res: any) => {
      if (!res || !res[0] || !res[0].node) return
      const canvas = res[0].node
      const dpr = uni.getSystemInfoSync().pixelRatio
      canvas.width = props.size * dpr
      canvas.height = props.size * dpr
      const ctx = canvas.getContext('2d')!
      ctx.scale(dpr, dpr)

      // 配色
      const colorAxis = '#E5E7EB' // 轴线颜色（浅灰）
      const colorGrid = '#E5E7EB' // 网格颜色（浅灰）
      const colorFill = '#3B82F6' // 填充/数据线/圆点（蓝色）
      const labelNameColor = '#374151' // 标签名称颜色
      const bgColor = '#FFFFFF' // 背景

      const W = props.size
      const H = props.size
      const cx = W / 2
      const cy = H / 2
      const maxRadius = (Math.min(W, H) / 2) * 0.52
      const layers = 4
      const sides = props.dimensions.length
      const angleStep = (Math.PI * 2) / sides
      const startAngle = -Math.PI / 2

      // 清空画布
      ctx.clearRect(0, 0, W, H)

      // 绘制网格多边形
      ctx.lineWidth = 1
      for (let layer = 1; layer <= layers; layer++) {
        const r = (maxRadius / layers) * layer
        ctx.beginPath()
        for (let i = 0; i <= sides; i++) {
          const angle = startAngle + i * angleStep
          const x = cx + r * Math.cos(angle)
          const y = cy + r * Math.sin(angle)
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
        }
        ctx.closePath()
        ctx.strokeStyle = colorGrid
        ctx.stroke()
      }

      // 绘制轴线
      ctx.strokeStyle = colorAxis
      ctx.beginPath()
      for (let i = 0; i < sides; i++) {
        const angle = startAngle + i * angleStep
        ctx.moveTo(cx, cy)
        ctx.lineTo(cx + maxRadius * Math.cos(angle), cy + maxRadius * Math.sin(angle))
      }
      ctx.stroke()

      // 绘制数据区域
      const pts: { x: number; y: number }[] = []
      ctx.beginPath()
      for (let i = 0; i < sides; i++) {
        const val = props.dimensions[i].score / 100
        const angle = startAngle + i * angleStep
        const r = maxRadius * val
        const x = cx + r * Math.cos(angle)
        const y = cy + r * Math.sin(angle)
        pts.push({ x, y })
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.closePath()
      ctx.fillStyle = hexToRGBA(colorFill, 0.12)
      ctx.fill()
      ctx.strokeStyle = colorFill
      ctx.lineWidth = 1.5
      ctx.stroke()

      // 绘制数据点（蓝底 + 白色外圈）
      const dotRadius = Math.max(3, W / 80)
      for (const pt of pts) {
        // 外圈白色
        ctx.beginPath()
        ctx.arc(pt.x, pt.y, dotRadius + 1.5, 0, Math.PI * 2)
        ctx.fillStyle = bgColor
        ctx.fill()
        // 内圈蓝色
        ctx.beginPath()
        ctx.arc(pt.x, pt.y, dotRadius, 0, Math.PI * 2)
        ctx.fillStyle = colorFill
        ctx.fill()
      }

      // 绘制标签
      const fontSizeName = Math.max(10, Math.round(W / 28))
      const fontSizeScore = Math.max(10, Math.round(W / 30))
      const labelRadius = maxRadius * 1.42

      for (let i = 0; i < sides; i++) {
        const angle = startAngle + i * angleStep
        const lx = cx + labelRadius * Math.cos(angle)
        const ly = cy + labelRadius * Math.sin(angle)

        const dim = props.dimensions[i]

        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'

        // 名称
        ctx.font = `500 ${fontSizeName}px -apple-system, sans-serif`
        ctx.fillStyle = labelNameColor
        ctx.fillText(dim.name, lx, ly - fontSizeScore * 0.75)

        // 分数
        ctx.font = `500 ${fontSizeScore}px -apple-system, sans-serif`
        ctx.fillStyle = colorFill
        ctx.fillText(String(dim.score) + '分', lx, ly + fontSizeScore * 0.75)
      }
    })
}

function hexToRGBA(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

onMounted(() => {
  drawRadar()
})

watch(
  () => [props.dimensions, props.size],
  () => {
    // 延迟等待 DOM 更新后重绘
    setTimeout(drawRadar, 50)
  },
  { deep: true }
)
</script>

<style lang="scss" scoped>
.radar-chart {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  &__canvas {
    display: block;
    pointer-events: none;
  }
}
</style>
