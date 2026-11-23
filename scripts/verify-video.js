// Run with Playwright CLI's run-code command. Media responses are mocked locally.
async page => {
  const assert = (condition, message) => { if (!condition) throw new Error(message) }
  const film = '**/*Creative%20Showreel*'
  let fail = true
  await page.unroute(film)
  await page.route(film, route => fail
    ? route.fulfill({ status: 404, body: '' })
    : route.fulfill({ path: 'public/videos/benefit-workflow.mp4', contentType: 'video/mp4' }))
  await page.addInitScript(() => { localStorage.setItem('cs-consent', 'denied') })
  await page.goto('http://localhost:3000/')
  await page.evaluate(() => { sessionStorage.removeItem('cs-video-test-block') })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const trigger = page.locator('#performance-showreel')
  await trigger.scrollIntoViewIfNeeded()
  await page.waitForFunction(() => !document.querySelector('#performance-showreel')?.closest('astro-island')?.hasAttribute('ssr'))
  await trigger.click()
  const dialog = page.getByRole('dialog')
  await dialog.getByText('We couldn’t load this film. Please try again.').waitFor()
  assert(await dialog.getByRole('button', { name: 'Play', exact: true }).isVisible(), 'Failed film must not claim it is playing')
  assert(await dialog.getByRole('slider', { name: 'Seek' }).isDisabled(), 'Failed film must disable seek')
  fail = false
  await dialog.getByRole('button', { name: 'Try again', exact: true }).click()
  await dialog.getByRole('button', { name: 'Pause', exact: true }).waitFor()
  await page.waitForFunction(() => !document.querySelector('input[aria-label=Seek]')?.disabled)
  await page.keyboard.press('Escape')
  await dialog.waitFor({ state: 'hidden' })
  await page.waitForFunction(() => document.activeElement?.id === 'performance-showreel')

  // Block automatic playback while allowing an explicit subsequent user action.
  await page.addInitScript(() => {
    const play = HTMLMediaElement.prototype.play
    HTMLMediaElement.prototype.play = function () {
      if (this.parentElement?.classList.contains('group/player') && sessionStorage.getItem('cs-video-test-block') === 'true') return Promise.reject(new DOMException('Playback requires a gesture', 'NotAllowedError'))
      return play.call(this)
    }
  })
  await page.evaluate(() => { sessionStorage.setItem('cs-video-test-block', 'true') })
  await page.reload()
  await trigger.scrollIntoViewIfNeeded()
  await page.waitForFunction(() => !document.querySelector('#performance-showreel')?.closest('astro-island')?.hasAttribute('ssr'))
  await trigger.focus()
  await page.keyboard.press('Enter')
  await dialog.waitFor()
  await dialog.getByRole('button', { name: 'Play film', exact: true }).waitFor()
  assert(await dialog.getByRole('button', { name: 'Play', exact: true }).isVisible(), 'Blocked autoplay must show Play')
  await page.evaluate(() => { sessionStorage.removeItem('cs-video-test-block') })
  await dialog.getByRole('button', { name: 'Play film', exact: true }).click()
  await dialog.getByRole('button', { name: 'Pause', exact: true }).waitFor()
  await dialog.getByRole('button', { name: 'Close video' }).focus()
  assert(await dialog.getByRole('button', { name: 'Close video' }).isVisible(), 'Close must remain visible on keyboard focus')
  await page.keyboard.press('Escape')
  await dialog.waitFor({ state: 'hidden' })
  await page.evaluate(() => { window.videoChecks = ['Failed source, disabled seek and retry', 'Blocked autoplay and user playback', 'Keyboard close and focus return'] })
}
