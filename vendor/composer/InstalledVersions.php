<?php











namespace Composer;

use Composer\Semver\VersionParser;






class InstalledVersions
{
private static $installed = array (
  'root' => 
  array (
    'pretty_version' => 'dev-main',
    'version' => 'dev-main',
    'aliases' => 
    array (
    ),
    'reference' => '1958798540be9ff3fbca9ce8aa4914878032f134',
    'name' => '__root__',
  ),
  'versions' => 
  array (
    '__root__' => 
    array (
      'pretty_version' => 'dev-main',
      'version' => 'dev-main',
      'aliases' => 
      array (
      ),
      'reference' => '1958798540be9ff3fbca9ce8aa4914878032f134',
    ),
    'pimple/pimple' => 
    array (
      'pretty_version' => 'v1.1.1',
      'version' => '1.1.1.0',
      'aliases' => 
      array (
      ),
      'reference' => '2019c145fe393923f3441b23f29bbdfaa5c58c4d',
    ),
    'psr/log' => 
    array (
      'pretty_version' => '1.1.3',
      'version' => '1.1.3.0',
      'aliases' => 
      array (
      ),
      'reference' => '0f73288fd15629204f9d42b7055f72dacbe811fc',
    ),
    'silex/silex' => 
    array (
      'pretty_version' => 'v1.3.6',
      'version' => '1.3.6.0',
      'aliases' => 
      array (
      ),
      'reference' => 'ff8aa6bc2e066e14b07e0c63e9bd9dd1458af136',
    ),
    'symfony/debug' => 
    array (
      'pretty_version' => 'v3.4.47',
      'version' => '3.4.47.0',
      'aliases' => 
      array (
      ),
      'reference' => 'ab42889de57fdfcfcc0759ab102e2fd4ea72dcae',
    ),
    'symfony/event-dispatcher' => 
    array (
      'pretty_version' => 'v3.0.9',
      'version' => '3.0.9.0',
      'aliases' => 
      array (
      ),
      'reference' => '54da3ff63dec3c9c0e32ec3f95a7d94ef64baa00',
    ),
    'symfony/http-foundation' => 
    array (
      'pretty_version' => 'v3.0.9',
      'version' => '3.0.9.0',
      'aliases' => 
      array (
      ),
      'reference' => '49ba00f8ede742169cb6b70abe33243f4d673f82',
    ),
    'symfony/http-kernel' => 
    array (
      'pretty_version' => 'v3.0.9',
      'version' => '3.0.9.0',
      'aliases' => 
      array (
      ),
      'reference' => 'd97ba4425e36e79c794e7d14ff36f00f081b37b3',
    ),
    'symfony/polyfill-mbstring' => 
    array (
      'pretty_version' => 'v1.20.0',
      'version' => '1.20.0.0',
      'aliases' => 
      array (
      ),
      'reference' => '39d483bdf39be819deabf04ec872eb0b2410b531',
    ),
    'symfony/routing' => 
    array (
      'pretty_version' => 'v3.0.9',
      'version' => '3.0.9.0',
      'aliases' => 
      array (
      ),
      'reference' => '9038984bd9c05ab07280121e9e10f61a7231457b',
    ),
  ),
);







public static function getInstalledPackages()
{
return array_keys(self::$installed['versions']);
}









public static function isInstalled($packageName)
{
return isset(self::$installed['versions'][$packageName]);
}














public static function satisfies(VersionParser $parser, $packageName, $constraint)
{
$constraint = $parser->parseConstraints($constraint);
$provided = $parser->parseConstraints(self::getVersionRanges($packageName));

return $provided->matches($constraint);
}










public static function getVersionRanges($packageName)
{
if (!isset(self::$installed['versions'][$packageName])) {
throw new \OutOfBoundsException('Package "' . $packageName . '" is not installed');
}

$ranges = array();
if (isset(self::$installed['versions'][$packageName]['pretty_version'])) {
$ranges[] = self::$installed['versions'][$packageName]['pretty_version'];
}
if (array_key_exists('aliases', self::$installed['versions'][$packageName])) {
$ranges = array_merge($ranges, self::$installed['versions'][$packageName]['aliases']);
}
if (array_key_exists('replaced', self::$installed['versions'][$packageName])) {
$ranges = array_merge($ranges, self::$installed['versions'][$packageName]['replaced']);
}
if (array_key_exists('provided', self::$installed['versions'][$packageName])) {
$ranges = array_merge($ranges, self::$installed['versions'][$packageName]['provided']);
}

return implode(' || ', $ranges);
}





public static function getVersion($packageName)
{
if (!isset(self::$installed['versions'][$packageName])) {
throw new \OutOfBoundsException('Package "' . $packageName . '" is not installed');
}

if (!isset(self::$installed['versions'][$packageName]['version'])) {
return null;
}

return self::$installed['versions'][$packageName]['version'];
}





public static function getPrettyVersion($packageName)
{
if (!isset(self::$installed['versions'][$packageName])) {
throw new \OutOfBoundsException('Package "' . $packageName . '" is not installed');
}

if (!isset(self::$installed['versions'][$packageName]['pretty_version'])) {
return null;
}

return self::$installed['versions'][$packageName]['pretty_version'];
}





public static function getReference($packageName)
{
if (!isset(self::$installed['versions'][$packageName])) {
throw new \OutOfBoundsException('Package "' . $packageName . '" is not installed');
}

if (!isset(self::$installed['versions'][$packageName]['reference'])) {
return null;
}

return self::$installed['versions'][$packageName]['reference'];
}





public static function getRootPackage()
{
return self::$installed['root'];
}







public static function getRawData()
{
return self::$installed;
}



















public static function reload($data)
{
self::$installed = $data;
}
}
