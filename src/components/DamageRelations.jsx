import { useEffect, useState } from "react";
import Type from "./Type";

const DamageRelations = ({ damages }) => {
  // console.log(damages);
  const [damagePokemonForm, setDamagePokemonForm] = useState();

  useEffect(() => {
    const arrayDamge = damages.map((damage) =>
      separateObjectBetweenToAndFrom(damage)
    );
    if (arrayDamge.length === 2) {
      // 합치는 부분
      const obj = joinDamageRelations(arrayDamge);
      postDamageValue(obj.from);
      setDamagePokemonForm(reduceDuplicateValues(postDamageValue(obj.from)));
    } else {
      setDamagePokemonForm(postDamageValue(arrayDamge[0].from));
    }
  }, []);

  const joinDamageRelations = (props) => {
    return {
      to: joinObjects(props, "to"),
      from: joinObjects(props, "from"),
    };
  };

  const reduceDuplicateValues = (props) => {
    const duplicateValues = {
      double_damage: "4x",
      half_damage: "1/4x",
      no_damage: "0x",
    };
    return Object.entries(props).reduce((acc, [keyName, value]) => {
      const key = keyName;
      // console.log([keyName, value]);
      const verifiedValue = filterForUniqueValues(value, duplicateValues[key]);
      return (acc = { [keyName]: verifiedValue, ...acc });
    }, {});
  };

  const filterForUniqueValues = (valueForFiltering, damageValue) => {
    return valueForFiltering.reduce((acc, currentValue) => {
      const { url, name } = currentValue;
      // console.log(url, name);

      const filterACC = acc.filter((a) => a.name !== name);

      return filterACC.length === acc.length
        ? (acc = [currentValue, ...acc])
        : (acc = [{ damageValue: damageValue, name, url }, ...filterACC]);
    }, []);
  };

  const joinObjects = (props, string) => {
    const key = string;
    const firstArrayValue = props[0][key];
    const secondArrayValue = props[1][key];
    const result = Object.entries(secondArrayValue).reduce(
      (acc, [keyName, value]) => {
        // console.log(acc, [keyName, value]);
        const result = firstArrayValue[keyName].concat(value);
        return (acc = { [keyName]: result, ...acc });
      },
      {}
    );
    return result;
  };

  const postDamageValue = (props) => {
    const result = Object.entries(props).reduce((acc, [keyName, value]) => {
      const key = keyName;

      const valueOfKeyName = {
        double_damage: "2x",
        half_damage: "1/2x",
        no_damage: "0x",
      };
      // console.log(acc, [keyName, value]);
      return (
        acc,
        {
          [keyName]: value.map((i) => ({
            damageValue: valueOfKeyName[key],
            ...i,
          })),
          ...acc,
        }
      );
    }, {});
    // console.log(result);
    return result;
  };

  const separateObjectBetweenToAndFrom = (damage) => {
    const from = filterDamageRelations("_from", damage);
    const to = filterDamageRelations("_to", damage);
    return { from, to };
  };

  const filterDamageRelations = (valueFilter, damage) => {
    const result = Object.entries(damage)
      .filter(([keyName, value]) => {
        return keyName.includes(valueFilter);
      })
      .reduce((acc, [KeyName, value]) => {
        const keyWithValueFilterRemove = KeyName.replace(valueFilter, "");
        // console.log(acc);
        return (acc = { [keyWithValueFilterRemove]: value, ...acc });
      }, {});
    return result;
  };

  return (
    <div className="flex gap-2 flex-col m-auto">
      {damagePokemonForm ? (
        <>
          {Object.entries(damagePokemonForm).map(([keyName, value]) => {
            const key = keyName;
            const valueOfKeyName = {
              double_damage: "Weak",
              half_damage: "Registant",
              no_damage: "Imune",
            };
            return (
              <div key={key}>
                <h3 className=" capitalize mb-1 font-semibold text-sm md:text-base text-slate-500 text-center">
                  {valueOfKeyName[key]}
                </h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {value.length > 0 ? (
                    value.map(({ name, url, damageValue }) => {
                      return (
                        <Type type={name} key={url} damageValue={damageValue} />
                      );
                    })
                  ) : (
                    <Type type={"none"} key={"none"} />
                  )}
                </div>
              </div>
            );
          })}
        </>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default DamageRelations;
